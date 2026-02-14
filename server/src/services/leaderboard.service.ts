import prisma from '../config/database';

export interface LeaderboardEntry {
    userId: string;
    username: string;
    totalScore: number;
    quizzesAttempted: number;
    averagePercentage: number;
}

export class LeaderboardService {
    async getGlobalLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
        // Fetch all attempts with user information
        const attempts = await prisma.quizAttempt.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        });

        // Aggregate data by user
        const userStats: Record<string, { username: string; totalScore: number; count: number; totalPercentage: number }> = {};

        attempts.forEach((attempt: any) => {
            const userId = attempt.userId;
            if (!userStats[userId]) {
                userStats[userId] = {
                    username: attempt.user.username,
                    totalScore: 0,
                    count: 0,
                    totalPercentage: 0
                };
            }
            userStats[userId].totalScore += attempt.score;
            userStats[userId].count += 1;
            userStats[userId].totalPercentage += (attempt.score / attempt.totalQuestions) * 100;
        });

        // Convert to array and calculate averages
        const leaderboard: LeaderboardEntry[] = Object.entries(userStats).map(([userId, stats]) => ({
            userId,
            username: stats.username,
            totalScore: stats.totalScore,
            quizzesAttempted: stats.count,
            averagePercentage: Number((stats.totalPercentage / stats.count).toFixed(2))
        }));

        // Sort by total score descending
        return leaderboard
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, limit);
    }
}
