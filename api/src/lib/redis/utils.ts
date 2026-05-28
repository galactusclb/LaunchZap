import { redisClient } from "./redis-client";

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

export async function swrCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    opts: SwrOptions = initOptions
) {
    const cached = await redisClient?.get(key);

    if (cached) {
        const entry: CachedValue<T> = JSON.parse(cached);

        if (Date.now() < entry.freshUntil) {
            return entry.data
        }
        
        void refresh(key, fetcher, opts).catch((err)=> {
            console.error(`[swr] background refresh failed for ${key}`, err);
        });
        return entry.data;
    };

    return refresh(key, fetcher, opts);
};

async function refresh<T>(
    key: string,
    fetcher: () => Promise<T>,
    opts: SwrOptions
): Promise<T>{
    const lockKey = `${key}:lock`;
    const maxLockTtlMs = (opts.lockTtl ?? initOptions.lockTtl) * 1000;
    const minRetryIntervalMs   = 30; //fetcher duration - min
    const maxRetryIntervalMs   = 1000; //fetcher duration - max
    const maxRetryCount = 20;
    const jitterMs = 50; // de-sync simultaneous retries

    for (let attempt = 0; attempt < maxRetryCount; attempt++) {
        const acquired = await redisClient?.set(lockKey, "1", "PX", maxLockTtlMs, "NX");

        if (acquired) {
            try {
                const data = await fetcher();
                const entry: CachedValue<T> = {
                    data,
                    freshUntil: Date.now() + opts.freshTtl * 1000
                };

                await redisClient?.setex(key, opts.staleTtl, JSON.stringify(entry));
                return data;
            } finally {
                await redisClient?.del(lockKey);
            }
        }

        const cached = await redisClient?.get(key);
        if (cached) return (JSON.parse(cached) as CachedValue<T>).data;

        const delay = Math.min(minRetryIntervalMs * 2 ** attempt, maxRetryIntervalMs) + Math.random() * jitterMs;
        await new Promise(r => setTimeout(r, delay));
    }

    throw new Error("swr: failed to acquire lock or read cache after retries");
};