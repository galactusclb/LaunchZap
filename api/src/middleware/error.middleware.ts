import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@/prisma/client';

import { AppError } from '../utils/errors/app-errors.ts';
import { HttpError } from '../utils/errors/http-error.ts';

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('[Error]', err);

    let statusCode = 500;
    let message = 'Internal server error';
    let details: unknown;

    if (isPrismaError(err)) {
        return res.status(500).json({
            success: false,
            error: 'Database error. Please try again later.',
            details: {
                code: (err as Prisma.PrismaClientKnownRequestError).code || 'DB_ERROR',
            },
        });
    }

    if (err instanceof HttpError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details;

        return res.status(statusCode).json({
            success: false,
            error: message,
            details
        })
    }

    if (err instanceof AppError) {
        statusCode = 400;
        message = err.message;

        if (typeof err.details === "object" && err.details !== null) {
            details = { code: err.code, ...err.details };
        } else {
            details = { code: err.code, payload: err.details };
        }

        return res.status(statusCode).json({
            success: false,
            error: message,
            details,
        });
    }

    if (err instanceof Error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
        });
    }

    return res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
}

function isPrismaError(err: unknown): err is Prisma.PrismaClientKnownRequestError {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientInitializationError ||
    err instanceof Prisma.PrismaClientValidationError
  );
}