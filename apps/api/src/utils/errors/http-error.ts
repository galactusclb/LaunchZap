import { StatusCodes } from 'http-status-codes';

class HttpError extends Error {
    statusCode: number;
    details?: unknown;

    constructor(statusCode: number, message: string, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}

class BadRequestError extends HttpError {
    constructor(message = 'Bad request', details?: unknown) {
        super(StatusCodes.BAD_REQUEST, message, details);
    }
}

class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized', details?: unknown) {
        super(StatusCodes.UNAUTHORIZED, message, details);
    }
}

class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden', details?: unknown) {
        super(StatusCodes.FORBIDDEN, message, details);
    }
}

class NotFoundError extends HttpError {
    constructor(message = 'Resource not found', details?: unknown) {
        super(StatusCodes.NOT_FOUND, message, details);
    }
}

class ConflictError extends HttpError {
    constructor(message = 'Conflict', details?: unknown) {
        super(StatusCodes.CONFLICT, message, details);
    }
}

class TooManyRequestsError extends HttpError {
    constructor(message = 'Too many requests', details?: unknown) {
        super(StatusCodes.TOO_MANY_REQUESTS, message, details);
    }
}

class InternalServerError extends HttpError {
    constructor(message = 'Internal server error', details?: unknown) {
        super(StatusCodes.INTERNAL_SERVER_ERROR, message);
        this.details = details;
    }
}

class ServiceUnavailableError extends HttpError {
    constructor(message = 'Service unavailable', details?: number) {
        super(StatusCodes.SERVICE_UNAVAILABLE, message);
        this.details = details;
    }
}

export {
    HttpError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    TooManyRequestsError,
    InternalServerError,
    ServiceUnavailableError,
};
