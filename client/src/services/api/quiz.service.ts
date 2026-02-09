import apiClient from './client';

export interface QuizOption {
    id?: string;
    text: string;
    isCorrect: boolean;
    order: number;
}

export interface QuizQuestion {
    id?: string;
    text: string;
    order: number;
    options: QuizOption[];
}

export interface Quiz {
    id: string;
    title: string;
    description: string | null;
    createdBy: string;
    questions: QuizQuestion[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateQuizRequest {
    title: string;
    description?: string;
    questions: Omit<QuizQuestion, 'id'>[];
}

export interface UpdateQuizRequest {
    title?: string;
    description?: string;
    questions?: Omit<QuizQuestion, 'id'>[];
}

export const quizService = {
    async getAll(): Promise<Quiz[]> {
        const response = await apiClient.get<any>('/quizzes');
        return response.data.data;
    },

    async getById(id: string): Promise<Quiz> {
        const response = await apiClient.get<any>(`/quizzes/${id}`);
        return response.data.data;
    },

    async create(data: CreateQuizRequest): Promise<Quiz> {
        const response = await apiClient.post<any>('/quizzes', data);
        return response.data.data;
    },

    async update(id: string, data: UpdateQuizRequest): Promise<Quiz> {
        const response = await apiClient.put<any>(`/quizzes/${id}`, data);
        return response.data.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/quizzes/${id}`);
    },
};
