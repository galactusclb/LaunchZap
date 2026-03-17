import orderRoutes from '@/features/order/index.ts';
import productRoutes from '@/features/product/index.ts';
import { errorHandler } from '@/middleware/error.middleware.ts';

import cookieParser from 'cookie-parser';

import cors from 'cors';

import express, { Request, Response } from 'express';

import rateLimit from 'express-rate-limit';

const app = express();
const apiRouter = express.Router();

const allowedOrigins = [
  'http://localhost:3000',
  'https://api.cleaoo.com',
  'https://cs.cleaoo.com',
  'https://cs-dev.cleaoo.com',
  'http://localhost:8081',
  'http://api.localhost:8081',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use((req: Request, res: Response, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to CleanSweep API' });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

apiRouter.use('/orders', orderRoutes);
apiRouter.use('/products', productRoutes);

app.use('/api', apiRouter);

app.use(errorHandler);

export default app;
