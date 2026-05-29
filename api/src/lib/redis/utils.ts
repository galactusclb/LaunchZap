import { LRUCache } from "lru-cache";

import { redisClient } from "./redis-client";
import { logger } from "@/lib/logger";

import { ServiceUnavailableError } from "@/utils/errors/http-error";

type CachedValue<T> = {
    data: T,
    freshUntil: number
};

type SwrOptions = {
    freshTtl: number,
    staleTtl: number,
    lockTtl?: number
}

const initOptions: Required<SwrOptions> = {
    freshTtl: 60, //1min
    staleTtl: 300, //5min
    lockTtl: 10 //10s
}

const l2 = new LRUCache<string, string>({
    max: 500,
    ttl: 30 * 1000
});

export async function swrCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    opts: SwrOptions = initOptions
) {
    try {
        const cached = await redisClient?.get(key);

        if (cached) {
            const entry: CachedValue<T> = JSON.parse(cached);

            if (Date.now() < entry.freshUntil) {
                return entry.data
            }

            void refresh(key, fetcher, opts).catch((err) => {
                console.error(`[swr] background refresh failed for ${key}`, err);
            });
            return entry.data;
        };

        return refresh(key, fetcher, opts);
    } catch (error) {
        if (!(error instanceof ServiceUnavailableError)) throw error;
        logger.error(`[swr] Redis unavailable for ${key}, falling back to L2`, { error });
    }

    return lruHit(key, fetcher, opts);
};

async function refresh<T>(
    key: string,
    fetcher: () => Promise<T>,
    opts: SwrOptions
): Promise<T>{
    const maxLockTtlMs = (opts.lockTtl ?? initOptions.lockTtl) * 1000;
    const minRetryIntervalMs   = 30; //fetcher duration - min
    const maxRetryIntervalMs   = 1000; //fetcher duration - max
    const maxRetryCount = 20;
    const jitterMs = 50; // de-sync simultaneous retries

    for (let attempt = 0; attempt < maxRetryCount; attempt++) {
        const result = await withLock(
            key,
            async ()=> {
                const data = await fetcher();
                const entry: CachedValue<T> = {
                    data,
                    freshUntil: Date.now() + opts.freshTtl * 1000
                };

                await redisClient?.setex(key, opts.staleTtl, JSON.stringify(entry));
                return data;
            },
            maxLockTtlMs
        );

        if (result !== null) return result;

        const cached = await redisClient?.get(key);
        if (cached) return (JSON.parse(cached) as CachedValue<T>).data;

        const delay = Math.min(minRetryIntervalMs * 2 ** attempt, maxRetryIntervalMs) + Math.random() * jitterMs;
        await new Promise(r => setTimeout(r, delay));
    }

    throw new ServiceUnavailableError("Cache temporarily unavailable, please retry");
};

export async function withLock<T>(
    key: string,
    fn: () => Promise<T>,
    ttlMs: number = 5000
): Promise<T | null> {
    const lockKey = `${key}:lock`;
    const acquired = await redisClient?.set(lockKey, "1", "PX", ttlMs, "NX");

    if (!acquired) return null;

    try {
        return await fn();
    } finally {
        await redisClient?.del(lockKey);
    };
}

const l2Inflight = new Map<string, Promise<unknown>>();

async function lruHit<T>(
    key: string,
    fetcher: () => Promise<T>,
    opts: SwrOptions = initOptions
) {
    const l2Hit = l2.get(key);
    if (l2Hit) return (JSON.parse(l2Hit) as CachedValue<T>).data;

    const inFlight = l2Inflight.get(key) as Promise<T> | undefined;
    if (inFlight) return inFlight;

    const promise = fetcher().then(data=>{
        l2.set(key, JSON.stringify({ data, freshUntil: Date.now() + (opts.freshTtl * 1000) }));
        return data;
    }).finally(()=> l2Inflight.delete(key));

    l2Inflight.set(key, promise);
    return promise;
} 