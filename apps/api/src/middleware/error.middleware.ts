import { NextFunction, Request, Response } from 'express';

import { logger } from '@/lib/logger/index.ts';
import { Prisma } from '@/prisma/client';
import { AppError, IsAuthMiddlewareMissingError } from '@/utils/errors/app-errors.ts';
import { HttpError } from '@/utils/errors/http-error.ts';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
    logger.error('[Error]', {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
    });

    let statusCode = 500;
    let message = 'Internal server error';
    let details: unknown;

    if (err instanceof IsAuthMiddlewareMissingError) {
        logger.error('[Implementation Bug]', { message: err.message });
        return res.status(500).json({ success: false, error: 'Something went wrong' });
    }

    if (isPrismaError(err)) {
        return res.status(500).json({
            success: false,
            error: 'Database error. Please try again later.',
            details: {
                code: CODE_MAP[(err as Prisma.PrismaClientKnownRequestError).code] || 'DB_ERROR',
            },
        });
    }

    if (err instanceof HttpError) {
        statusCode = err.statusCode;
        message = err.message;
        details = err.details;

        if (statusCode === StatusCodes.TOO_MANY_REQUESTS) {
            const retryAfter = (details as Record<string, unknown>)?.retryAfter;
            if (typeof retryAfter === 'number') {
                res.setHeader('Retry-After', String(retryAfter));
            }
        }

        return res.status(statusCode).json({
            success: false,
            error: message,
            details,
        });
    }

    if (err instanceof AppError) {
        statusCode = 400;
        message = err.message;

        if (typeof err.details === 'object' && err.details !== null) {
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

    return res.status(500).json({
        success: false,
        error: message,
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

const CODE_MAP: Partial<Record<string, string>> = {
    P2002: 'CONFLICT',
    P2003: 'CONSTRAINT_VIOLATION',
    P2024: 'TIMEOUT',
    P2025: 'NOT_FOUND',
    P2034: 'CONFLICT',
};
