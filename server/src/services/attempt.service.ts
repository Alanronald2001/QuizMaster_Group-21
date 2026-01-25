import { IAttemptRepository, AttemptRepository, AttemptWithRelations } from '../repositories/attempt.repository';
import { IQuizRepository, QuizRepository } from '../repositories/quiz.repository';
import { SubmitAttemptDTO } from '../dtos/attempt.dto';
import { NotFoundError, ValidationError } from '../utils/errors';

export class AttemptService {
    private attemptRepository: IAttemptRepository;
    private quizRepository: IQuizRepository;

    constructor(attemptRepository?: IAttemptRepository, quizRepository?: IQuizRepository) {
        this.attemptRepository = attemptRepository || new AttemptRepository();
        this.quizRepository = quizRepository || new QuizRepository();
    }

    async submitAttempt(userId: string, data: SubmitAttemptDTO): Promise<AttemptWithRelations> {
        // Get quiz with questions and options
        const quiz = await this.quizRepository.findById(data.quizId);
        if (!quiz) {
            throw new NotFoundError('Quiz not found');
        }

        // Validate that all questions are answered
        const questionIds = quiz.questions.map(q => q.id);
        const answeredQuestionIds = data.answers.map(a => a.questionId);

        if (questionIds.length !== answeredQuestionIds.length) {
            throw new ValidationError('All questions must be answered');
        }

        // Validate that all answered questions belong to this quiz
        const invalidQuestions = answeredQuestionIds.filter(id => !questionIds.includes(id));
        if (invalidQuestions.length > 0) {
            throw new ValidationError('Invalid question IDs');
        }

        // Calculate score
        let score = 0;
        for (const answer of data.answers) {
            const question = quiz.questions.find(q => q.id === answer.questionId);
            if (!question) continue;

            const selectedOption = question.options.find(o => o.id === answer.optionId);
            if (selectedOption?.isCorrect) {
                score++;
            }
        }

        // Create attempt
        return this.attemptRepository.create(userId, data, score, quiz.questions.length);
    }

    async getAttemptById(id: string): Promise<AttemptWithRelations> {
        const attempt = await this.attemptRepository.findById(id);
        if (!attempt) {
            throw new NotFoundError('Attempt not found');
        }
        return attempt;
    }

    async getAttemptsByQuizId(quizId: string): Promise<AttemptWithRelations[]> {
        return this.attemptRepository.findByQuizId(quizId);
    }

    async getAttemptsByUserId(userId: string): Promise<AttemptWithRelations[]> {
        return this.attemptRepository.findByUserId(userId);
    }
}
