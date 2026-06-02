import app from './app.ts';
import { logger } from './lib/logger/index.ts';
import { getRedisClient } from './lib/redis/redis-client.ts';

const PORT = process.env.PORT || 4000;

async function boostrap() {
    getRedisClient(
        process.env.REDIS_CLIENT_URL
            ? { url: process.env.REDIS_CLIENT_URL, host: '', port: 6379 }
            : { host: process.env.REDIS_HOST!, port: 6379 }
    );
};

await boostrap();

app.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    logger.info(`Server running on port ${PORT} 🚀`);
    logger.info(`URL: ${url}`);
});
