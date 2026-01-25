import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { CreateQuizSchema, UpdateQuizSchema } from '../dtos/quiz.dto';

const router = Router();
const quizController = new QuizController();

// Public routes (authenticated users)
router.get('/', authenticate, quizController.getAllQuizzes);
router.get('/:id', authenticate, quizController.getQuizById);

// Admin only routes
router.post('/', authenticate, requireAdmin, validate(CreateQuizSchema), quizController.createQuiz);
router.put('/:id', authenticate, requireAdmin, validate(UpdateQuizSchema), quizController.updateQuiz);
router.delete('/:id', authenticate, requireAdmin, quizController.deleteQuiz);

export default router;
