import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { errorResponse } from '../utils/response';
import { env } from '../config/env';

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json(errorResponse(err.message));
    }

    // Log unexpected errors
    console.error('Unexpected error:', err);

    // Don't leak error details in production
    const message = env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(500).json(errorResponse(message));
};
