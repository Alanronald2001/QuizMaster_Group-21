import apiClient from './client';

export interface LeaderboardEntry {
    userId: string;
    username: string;
    totalScore: number;
    quizzesAttempted: number;
    averagePercentage: number;
}

export const leaderboardService = {
    getLeaderboard: async (limit: number = 10): Promise<LeaderboardEntry[]> => {
        const response = await apiClient.get<any>(`/leaderboard?limit=${limit}`);
        return response.data.data;
    },
};
