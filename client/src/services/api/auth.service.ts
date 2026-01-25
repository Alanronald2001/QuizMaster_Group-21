import apiClient from './client';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'STUDENT';
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: 'ADMIN' | 'STUDENT';
    };
}

export const authService = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    async getCurrentUser(): Promise<AuthResponse['user']> {
        const response = await apiClient.get<AuthResponse['user']>('/auth/me');
        return response.data;
    },
};
