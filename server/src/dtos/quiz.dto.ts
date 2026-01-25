import { z } from 'zod';

const QuizOptionSchema = z.object({
    text: z.string().min(1, 'Option text is required'),
    isCorrect: z.boolean(),
    order: z.number().int().min(0),
});

const QuizQuestionSchema = z.object({
    text: z.string().min(1, 'Question text is required'),
    order: z.number().int().min(0),
    options: z.array(QuizOptionSchema).min(2, 'At least 2 options are required'),
});

export const CreateQuizSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(1000).optional(),
    questions: z.array(QuizQuestionSchema).min(1, 'At least 1 question is required'),
}).refine(
    (data) => {
        // Validate that each question has exactly one correct answer
        return data.questions.every(q =>
            q.options.filter(o => o.isCorrect).length === 1
        );
    },
    {
        message: 'Each question must have exactly one correct answer',
    }
);

export const UpdateQuizSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    questions: z.array(QuizQuestionSchema).min(1).optional(),
}).refine(
    (data) => {
        // If questions are provided, validate them
        if (data.questions) {
            return data.questions.every(q =>
                q.options.filter(o => o.isCorrect).length === 1
            );
        }
        return true;
    },
    {
        message: 'Each question must have exactly one correct answer',
    }
);

export type CreateQuizDTO = z.infer<typeof CreateQuizSchema>;
export type UpdateQuizDTO = z.infer<typeof UpdateQuizSchema>;
export type QuizQuestionDTO = z.infer<typeof QuizQuestionSchema>;
export type QuizOptionDTO = z.infer<typeof QuizOptionSchema>;
