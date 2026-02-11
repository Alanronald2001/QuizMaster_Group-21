import apiClient from './client';

export interface Answer {
    questionId: string;
    optionId: string;
}

export interface SubmitAttemptRequest {
    quizId: string;
    answers: Answer[];
}

export interface QuizAttempt {
    id: string;
    score: number;
    totalQuestions: number;
    userId: string;
    quizId: string;
    submittedAt: string;
    answers: {
        id: string;
        questionId: string;
        optionId: string;
    }[];
    user?: {
        id: string;
        username: string;
        email: string;
        role: 'ADMIN' | 'STUDENT';
    };
    quiz?: {
        id: string;
        title: string;
        description: string | null;
        questions: any[];
    };
}

export interface AttemptStatistics {
    totalAttempts: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
}

export const attemptService = {
    async submit(data: SubmitAttemptRequest): Promise<QuizAttempt> {
        const response = await apiClient.post<any>('/attempts', data);
        return response.data.data;
    },

    async getById(id: string): Promise<QuizAttempt> {
        const response = await apiClient.get<any>(`/attempts/${id}`);
        return response.data.data;
    },

    async getByQuizId(quizId: string): Promise<QuizAttempt[]> {
        const response = await apiClient.get<any>(`/quizzes/${quizId}/attempts`);
        return response.data.data;
    },

    async getByUserId(userId: string): Promise<QuizAttempt[]> {
        const response = await apiClient.get<any>(`/users/${userId}/attempts`);
        return response.data.data;
    },

    async getMyAttempts(): Promise<QuizAttempt[]> {
        const response = await apiClient.get<any>('/attempts/me');
        return response.data.data;
    },

    async getAll(): Promise<QuizAttempt[]> {
        const response = await apiClient.get<any>('/attempts');
        return response.data.data;
    },

    async getStatistics(quizId: string): Promise<AttemptStatistics> {
        const response = await apiClient.get<any>(`/analytics/quizzes/${quizId}`);
        return response.data.data;
    },
};
