import { LRUCache } from 'lru-cache';

import { logger } from '@/lib/logger';
import { ServiceUnavailableError, TooManyRequestsError } from '@/utils/errors/http-error';

import { redisClient } from './redis-client';
class FetcherError {
    constructor(public cause: unknown) {}
}

type CachedValue<T> = {
    data: T;
    freshUntil: number;
};

type SwrOptions = {
    redis_fresh_ttl: number;
    redis_stale_ttl: number;
    lockTtl?: number;
};

const initOptions: Required<SwrOptions> = {
    redis_fresh_ttl: 60, //1min
    redis_stale_ttl: 300, //5min
    lockTtl: 10, //10s
};

const l2 = new LRUCache<string, string>({
    max: 500,
    ttl: 30 * 1000,
});

/**
 * Stale-While-Revalidate cache backed by Redis (L1) with an LRU fallback (L2).
 *
 * Returns cached data immediately and triggers a background refresh when the
 * entry is stale but within the stale window. Falls back to the in-process LRU
 * cache if Redis is unavailable.
 *
 * @example
 * const products = await swrCache(
 *   'products:featured',
 *   () => db.product.findMany({ where: { featured: true } }),
 *   { redis_fresh_ttl: 30, redis_stale_ttl: 120 }
 * );
 *
 * @param key            Redis cache key
 * @param fetcher        Async function that fetches the canonical data
 * @param opts.redis_fresh_ttl   Seconds before the entry is considered stale (default 60)
 * @param opts.redis_stale_ttl   Seconds before Redis evicts the entry entirely (default 300)
 * @param opts.lockTtl           Seconds the refresh lock is held (default 10)
 */
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
                return entry.data;
            }

            void refresh(key, fetcher, opts).catch((err) => {
                console.error(`[swr] background refresh failed for ${key}`, err);
            });
            return entry.data;
        }

        return refresh(key, fetcher, opts);
    } catch (error) {
        if (!(error instanceof ServiceUnavailableError)) throw error;
        logger.error(`[swr] Redis unavailable for ${key}, falling back to L2`, { error });
    }

    return lruHit(key, fetcher, opts);
}

async function refresh<T>(key: string, fetcher: () => Promise<T>, opts: SwrOptions): Promise<T> {
    const maxLockTtlMs = (opts.lockTtl ?? initOptions.lockTtl) * 1000;
    const minRetryIntervalMs = 30; //fetcher duration - min
    const maxRetryIntervalMs = 1000; //fetcher duration - max
    const maxRetryCount = 20;
    const jitterMs = 50; // de-sync simultaneous retries

    for (let attempt = 0; attempt < maxRetryCount; attempt++) {
        let result: T | null;

        try {
            result = await withLock(
                key,
                async () => {
                    let data: T;

                    try {
                        data = await fetcher();
                    } catch (cause) {
                        throw new FetcherError(cause);
                    }

                    try {
                        const entry: CachedValue<T> = {
                            data,
                            freshUntil: Date.now() + opts.redis_fresh_ttl * 1000,
                        };

                        await redisClient?.setex(key, opts.redis_stale_ttl, JSON.stringify(entry));
                    } catch {}

                    return data;
                },
                maxLockTtlMs
            );
        } catch (err) {
            if (err instanceof FetcherError) throw err.cause;
            throw new ServiceUnavailableError('Cache temporarily unavailable, please retry');
        }

        if (result !== null) return result;

        let cached: string | null | undefined;

        try {
            cached = await redisClient?.get(key);
        } catch {
            throw new ServiceUnavailableError('Cache temporarily unavailable, please retry');
        }

        if (cached) return (JSON.parse(cached) as CachedValue<T>).data;

        const delay =
            Math.min(minRetryIntervalMs * 2 ** attempt, maxRetryIntervalMs) +
            Math.random() * jitterMs;
        await new Promise((r) => setTimeout(r, delay));
    }

    throw new ServiceUnavailableError('Cache temporarily unavailable, please retry');
}

/**
 * Acquires a Redis-backed distributed lock for the duration of `fn`.
 *
 * Returns `null` immediately if the lock is already held by another caller,
 * so the caller can treat `null` as "another process is refreshing — wait and retry."
 *
 * @example
 * const result = await withLock('job:send-digest', async () => {
 *   await sendDigestEmail();
 *   return true;
 * }, 15_000);
 * if (result === null) console.log('lock contended, skipped');
 *
 * @param key    Base key; `:lock` is appended internally
 * @param fn     Work to execute while the lock is held
 * @param ttlMs  Lock expiry in milliseconds (default 5 000)
 */
export async function withLock<T>(
    key: string,
    fn: () => Promise<T>,
    ttlMs: number = 5000
): Promise<T | null> {
    const lockKey = `${key}:lock`;
    const acquired = await redisClient?.set(lockKey, '1', 'PX', ttlMs, 'NX');

    if (!acquired) return null;

    try {
        return await fn();
    } finally {
        await redisClient?.del(lockKey);
    }
}

/**
 * Atomic Redis-backed rate limiter using INCR + EXPIRE.
 *
 * Increments a counter on every call and throws `TooManyRequestsError` once
 * `maximumBouncerLimit` is exceeded within the TTL window. The counter is set
 * to expire only on the **first** increment, so the window is sliding from the
 * first attempt, not from the latest.
 *
 * @example
 * await rateLimiter(`launch:${userId}`, 3, 60 * 60); // max 3 launches/hour
 *
 * @param rateBouncerKey       Redis key for this action + subject (e.g. `launch:${userId}`)
 * @param maximumBouncerLimit  Calls allowed within the window before throwing
 * @param ttlS                 Window size in seconds (default 3 600 — 1 hour)
 * @throws {TooManyRequestsError} when the limit is exceeded
 * @throws {ServiceUnavailableError} when Redis is unreachable
 */
export async function rateLimiter(
    rateBouncerKey: string,
    maximumBouncerLimit: number,
    ttlS: number = 60 * 60 // 1 hour
) {
    if (!redisClient) {
        throw new ServiceUnavailableError('Rate limiter unavailable');
    }

    const attempts = (await redisClient.eval(
        `local n = redis.call('INCR', KEYS[1])
         if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
         return n`,
        1,
        rateBouncerKey,
        String(ttlS)
    )) as number;

    if (attempts && attempts > maximumBouncerLimit) {
        throw new TooManyRequestsError('Too many launch attempts. Try again in an hour.', {
            retryAfter: ttlS,
        });
    }

    return true;
}

const l2Inflight = new Map<string, Promise<unknown>>();

async function lruHit<T>(key: string, fetcher: () => Promise<T>, opts: SwrOptions = initOptions) {
    const l2Hit = l2.get(key);
    if (l2Hit) return (JSON.parse(l2Hit) as CachedValue<T>).data;

    const inFlight = l2Inflight.get(key) as Promise<T> | undefined;
    if (inFlight) return inFlight;

    const promise = fetcher()
        .then((data) => {
            l2.set(
                key,
                JSON.stringify({ data, freshUntil: Date.now() + opts.redis_fresh_ttl * 1000 })
            );
            return data;
        })
        .finally(() => l2Inflight.delete(key));

    l2Inflight.set(key, promise);
    return promise;
}
