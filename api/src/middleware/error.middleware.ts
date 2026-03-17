import { Request, Response, NextFunction } from 'express';

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
    let message = "Internal server error";
    let details: unknown;

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
        statusCode = 400;
        message = err.message;

        return res.status(statusCode).json({
            success: false,
            error: message,
        });
    }

    return res.status(statusCode).json({
        success: false,
        error: message,
    });
}