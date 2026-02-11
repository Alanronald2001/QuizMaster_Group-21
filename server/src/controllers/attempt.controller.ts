import { Request, Response, NextFunction } from 'express';
import { AttemptService } from '../services/attempt.service';
import { successResponse } from '../utils/response';

const attemptService = new AttemptService();

export class AttemptController {
    async submitAttempt(req: Request, res: Response, next: NextFunction) {
        try {
            const attempt = await attemptService.submitAttempt(req.user!.id, req.body);
            res.status(201).json(successResponse(attempt, 'Quiz submitted successfully'));
        } catch (error) {
            next(error);
        }
    }

    async getAttemptById(req: Request, res: Response, next: NextFunction) {
        try {
            const attempt = await attemptService.getAttemptById(req.params.id as string);
            res.json(successResponse(attempt));
        } catch (error) {
            next(error);
        }
    }

    async getAttemptsByQuizId(req: Request, res: Response, next: NextFunction) {
        try {
            const attempts = await attemptService.getAttemptsByQuizId(req.params.quizId as string);
            res.json(successResponse(attempts));
        } catch (error) {
            next(error);
        }
    }

    async getMyAttempts(req: Request, res: Response, next: NextFunction) {
        try {
            const attempts = await attemptService.getAttemptsByUserId(req.user!.id);
            res.json(successResponse(attempts));
        } catch (error) {
            next(error);
        }
    }

    async getAttemptsByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const attempts = await attemptService.getAttemptsByUserId(req.params.userId as string);
            res.json(successResponse(attempts));
        } catch (error) {
            next(error);
        }
    }

    async getAllAttempts(req: Request, res: Response, next: NextFunction) {
        try {
            const attempts = await attemptService.getAllAttempts();
            res.json(successResponse(attempts));
        } catch (error) {
            next(error);
        }
    }
}
