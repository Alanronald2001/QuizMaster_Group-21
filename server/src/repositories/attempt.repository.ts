import prisma from '../config/database';
import type { QuizAttempt, Answer } from '@prisma/client';
import { SubmitAttemptDTO } from '../dtos/attempt.dto';

export interface AttemptWithRelations extends QuizAttempt {
    answers: Answer[];
    user?: {
        id: string;
        username: string;
        email: string;
    };
    quiz?: {
        id: string;
        title: string;
        description: string | null;
    };
}

export interface IAttemptRepository {
    create(userId: string, data: SubmitAttemptDTO, score: number, totalQuestions: number): Promise<AttemptWithRelations>;
    findById(id: string): Promise<AttemptWithRelations | null>;
    findByQuizId(quizId: string): Promise<AttemptWithRelations[]>;
    findByUserId(userId: string): Promise<AttemptWithRelations[]>;
}

export class AttemptRepository implements IAttemptRepository {
    async create(
        userId: string,
        data: SubmitAttemptDTO,
        score: number,
        totalQuestions: number
    ): Promise<AttemptWithRelations> {
        return prisma.quizAttempt.create({
            data: {
                userId,
                quizId: data.quizId,
                score,
                totalQuestions,
                answers: {
                    create: data.answers.map((a) => ({
                        questionId: a.questionId,
                        optionId: a.optionId,
                    })),
                },
            },
            include: {
                answers: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                    },
                },
            },
        }) as Promise<AttemptWithRelations>;
    }

    async findById(id: string): Promise<AttemptWithRelations | null> {
        return prisma.quizAttempt.findUnique({
            where: { id },
            include: {
                answers: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                    },
                },
            },
        }) as Promise<AttemptWithRelations | null>;
    }

    async findByQuizId(quizId: string): Promise<AttemptWithRelations[]> {
        return prisma.quizAttempt.findMany({
            where: { quizId },
            include: {
                answers: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        }) as Promise<AttemptWithRelations[]>;
    }

    async findByUserId(userId: string): Promise<AttemptWithRelations[]> {
        return prisma.quizAttempt.findMany({
            where: { userId },
            include: {
                answers: true,
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
                quiz: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        }) as Promise<AttemptWithRelations[]>;
    }
}
