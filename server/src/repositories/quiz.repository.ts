import prisma from '../config/database';
import type { Quiz, Question, Option } from '@prisma/client';
import { CreateQuizDTO, UpdateQuizDTO } from '../dtos/quiz.dto';

export interface QuizWithRelations extends Quiz {
    questions: (Question & { options: Option[] })[];
}

export interface IQuizRepository {
    create(userId: string, data: CreateQuizDTO): Promise<QuizWithRelations>;
    findAll(): Promise<QuizWithRelations[]>;
    findById(id: string): Promise<QuizWithRelations | null>;
    update(id: string, data: UpdateQuizDTO): Promise<QuizWithRelations>;
    delete(id: string): Promise<void>;
    findByCreator(userId: string): Promise<QuizWithRelations[]>;
}

export class QuizRepository implements IQuizRepository {
    async create(userId: string, data: CreateQuizDTO): Promise<QuizWithRelations> {
        return prisma.quiz.create({
            data: {
                title: data.title,
                description: data.description,
                createdBy: userId,
                questions: {
                    create: data.questions.map((q) => ({
                        text: q.text,
                        order: q.order,
                        options: {
                            create: q.options.map((o) => ({
                                text: o.text,
                                isCorrect: o.isCorrect,
                                order: o.order,
                            })),
                        },
                    })),
                },
            },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        }) as Promise<QuizWithRelations>;
    }

    async findAll(): Promise<QuizWithRelations[]> {
        return prisma.quiz.findMany({
            include: {
                questions: {
                    include: {
                        options: {
                            orderBy: {
                                order: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }) as Promise<QuizWithRelations[]>;
    }

    async findById(id: string): Promise<QuizWithRelations | null> {
        return prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: {
                            orderBy: {
                                order: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        }) as Promise<QuizWithRelations | null>;
    }

    async update(id: string, data: UpdateQuizDTO): Promise<QuizWithRelations> {
        // If questions are provided, delete old ones and create new ones
        if (data.questions) {
            await prisma.question.deleteMany({
                where: { quizId: id },
            });
        }

        return prisma.quiz.update({
            where: { id },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.questions && {
                    questions: {
                        create: data.questions.map((q) => ({
                            text: q.text,
                            order: q.order,
                            options: {
                                create: q.options.map((o) => ({
                                    text: o.text,
                                    isCorrect: o.isCorrect,
                                    order: o.order,
                                })),
                            },
                        })),
                    },
                }),
            },
            include: {
                questions: {
                    include: {
                        options: {
                            orderBy: {
                                order: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        }) as Promise<QuizWithRelations>;
    }

    async delete(id: string): Promise<void> {
        await prisma.quiz.delete({
            where: { id },
        });
    }

    async findByCreator(userId: string): Promise<QuizWithRelations[]> {
        return prisma.quiz.findMany({
            where: { createdBy: userId },
            include: {
                questions: {
                    include: {
                        options: {
                            orderBy: {
                                order: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }) as Promise<QuizWithRelations[]>;
    }
}
