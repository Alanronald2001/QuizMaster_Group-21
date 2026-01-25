import { z } from 'zod';

const AnswerSchema = z.object({
    questionId: z.string().cuid(),
    optionId: z.string().cuid(),
});

export const SubmitAttemptSchema = z.object({
    quizId: z.string().cuid(),
    answers: z.array(AnswerSchema).min(1, 'At least one answer is required'),
});

export type SubmitAttemptDTO = z.infer<typeof SubmitAttemptSchema>;
export type AnswerDTO = z.infer<typeof AnswerSchema>;
