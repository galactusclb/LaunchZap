import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
      validatedBody?: unknown;
      validatedParams?: unknown;
      validatedHeaders?: unknown;
    }
  }
}