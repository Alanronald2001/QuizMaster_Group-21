import { Request, Response, NextFunction } from 'express';
import { QuizService } from '../services/quiz.service';
import { successResponse } from '../utils/response';

const quizService = new QuizService();

export class QuizController {
    async createQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const quiz = await quizService.createQuiz(req.user!.id, req.body);
            res.status(201).json(successResponse(quiz, 'Quiz created successfully'));
        } catch (error) {
            next(error);
        }
    }

    async getAllQuizzes(req: Request, res: Response, next: NextFunction) {
        try {
            const quizzes = await quizService.getAllQuizzes();
            res.json(successResponse(quizzes));
        } catch (error) {
            next(error);
        }
    }

    async getQuizById(req: Request, res: Response, next: NextFunction) {
        try {
            const quiz = await quizService.getQuizById(req.params.id);
            res.json(successResponse(quiz));
        } catch (error) {
            next(error);
        }
    }

    async updateQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            const quiz = await quizService.updateQuiz(req.params.id, req.user!.id, req.body);
            res.json(successResponse(quiz, 'Quiz updated successfully'));
        } catch (error) {
            next(error);
        }
    }

    async deleteQuiz(req: Request, res: Response, next: NextFunction) {
        try {
            await quizService.deleteQuiz(req.params.id, req.user!.id);
            res.json(successResponse(null, 'Quiz deleted successfully'));
        } catch (error) {
            next(error);
        }
    }
}
