import { Router } from 'express';
import { AttemptController } from '../controllers/attempt.controller';
import { authenticate, requireAdmin, requireStudent } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { SubmitAttemptSchema } from '../dtos/attempt.dto';

const router = Router();
const attemptController = new AttemptController();

// Student routes
router.post('/', authenticate, requireStudent, validate(SubmitAttemptSchema), attemptController.submitAttempt);
router.get('/me', authenticate, attemptController.getMyAttempts);
router.get('/:id', authenticate, attemptController.getAttemptById);

// Admin routes
router.get('/', authenticate, requireAdmin, attemptController.getAllAttempts);
router.get('/quiz/:quizId', authenticate, requireAdmin, attemptController.getAttemptsByQuizId);
router.get('/user/:userId', authenticate, requireAdmin, attemptController.getAttemptsByUserId);

export default router;
