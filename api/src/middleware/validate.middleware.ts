import { Request, Response, NextFunction } from 'express';

import { AnyZodObject, ZodError } from 'zod';

import { BadRequestError } from '../utils/errors/http-error.ts';

type Schemas = {
  headers?: AnyZodObject,
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

export const validate = (schemas: Schemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {

      if (schemas.headers) {
        const result = schemas.headers.parse(req.headers);
        req.headers = result
      }

      if (schemas.body) {
        const result = schemas.body.parse(req.body);
        req.body = result
      }

      if (schemas.params) {
        const result = schemas.params.parse(req.params);
        req.params = result
      }

      if (schemas.query) {
        const result = schemas.query.parse(req.query);
        req.query = result
      }

      return next();

    } catch (err) {
      if (err instanceof ZodError) {
        const formatted = err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message
        }))

        return next(new BadRequestError("Validation error", formatted));
      }

      return next(err)
    }
  };