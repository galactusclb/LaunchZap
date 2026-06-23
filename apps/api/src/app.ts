import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { type RedisReply, RedisStore } from 'rate-limit-redis';

import { routes as authRoutes } from '@/features/auth';
import { launchRoutes } from '@/features/launch';
import { routes as productRoutes } from '@/features/product';
import { routes as userRoutes } from '@/features/user';
import { configureXray, xrayClose, xrayOpen } from '@/lib/aws/xray';
import { logger } from '@/lib/logger';
import { redisClient } from '@/lib/redis/redis-client';
import { errorHandler } from '@/middleware/error.middleware.ts';

const app = express();
const apiRouter = express.Router();

const allowedOrigins = ['http://localhost:3000', process.env.WEB_APP_URL];

const store = makeStore();
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, store });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, store });

app.set('trust proxy', 1);
app.use(helmet());

configureXray();
app.use(xrayOpen);

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) === -1) {
                return callback(null, false);
            }
            return callback(null, true);
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);

app.use(cookieParser());

app.use('/api/auth', authLimiter);
app.use('/', apiLimiter);

app.use((req: Request, res: Response, next) => {
    if (req.originalUrl !== '/api/health') {
        logger.info(`[${req.method}] ${req.path}`);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const handleRoot = (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to LaunchZap API' });
};

app.get('/', handleRoot);

apiRouter.get('/', handleRoot);
apiRouter.get('/health', (_, res) => res.sendStatus(200));
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/launches', launchRoutes);
apiRouter.use('/products', productRoutes);

app.use('/api', apiRouter);

app.use(xrayClose);
app.use(errorHandler);

export default app;

function makeStore() {
    if (!redisClient) return undefined;

    return new RedisStore({
        sendCommand: (command: string, ...args: string[]) =>
            redisClient!.call(command, ...args) as Promise<RedisReply>,
        prefix: 'lz:api:rl',
    });
}
