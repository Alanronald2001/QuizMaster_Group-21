import { IQuizRepository, QuizRepository, QuizWithRelations } from '../repositories/quiz.repository';
import { CreateQuizDTO, UpdateQuizDTO } from '../dtos/quiz.dto';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class QuizService {
    private quizRepository: IQuizRepository;

    constructor(quizRepository?: IQuizRepository) {
        this.quizRepository = quizRepository || new QuizRepository();
    }

    async createQuiz(userId: string, data: CreateQuizDTO): Promise<QuizWithRelations> {
        return this.quizRepository.create(userId, data);
    }

    async getAllQuizzes(): Promise<QuizWithRelations[]> {
        return this.quizRepository.findAll();
    }

    async getQuizById(id: string): Promise<QuizWithRelations> {
        const quiz = await this.quizRepository.findById(id);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }
        return quiz;
    }

    async updateQuiz(id: string, userId: string, data: UpdateQuizDTO): Promise<QuizWithRelations> {
        const quiz = await this.quizRepository.findById(id);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }

        if (quiz.createdBy !== userId) {
            throw new ForbiddenError('You can only update your own quizzes');
        }

        return this.quizRepository.update(id, data);
    }

    async deleteQuiz(id: string, userId: string): Promise<void> {
        const quiz = await this.quizRepository.findById(id);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }

        if (quiz.createdBy !== userId) {
            throw new ForbiddenError('You can only delete your own quizzes');
        }

        await this.quizRepository.delete(id);
    }

    async getQuizzesByCreator(userId: string): Promise<QuizWithRelations[]> {
        return this.quizRepository.findByCreator(userId);
    }
}
