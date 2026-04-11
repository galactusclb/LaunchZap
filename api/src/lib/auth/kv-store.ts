import type { Redis as RedisClient } from 'ioredis';

type StoredValue = {
  value: string;
  expiresAtMs: number;
};

const memory = new Map<string, StoredValue>();

function nowMs() {
  return Date.now();
}

function gcMemory() {
  const now = nowMs();
  for (const [key, entry] of memory.entries()) {
    if (entry.expiresAtMs <= now) memory.delete(key);
  }
}

export async function kvGet(redis: RedisClient | null | undefined, key: string): Promise<string | null> {
  if (redis) return await redis.get(key);
  gcMemory();
  return memory.get(key)?.value ?? null;
}

export async function kvSetEx(
  redis: RedisClient | null | undefined,
  key: string,
  ttlSeconds: number,
  value: string,
): Promise<void> {
  if (redis) {
    await redis.setex(key, ttlSeconds, value);
    return;
  }
  gcMemory();
  memory.set(key, { value, expiresAtMs: nowMs() + ttlSeconds * 1000 });
}

export async function kvDel(redis: RedisClient | null | undefined, key: string): Promise<void> {
  if (redis) {
    await redis.del(key);
    return;
  }
  memory.delete(key);
}
