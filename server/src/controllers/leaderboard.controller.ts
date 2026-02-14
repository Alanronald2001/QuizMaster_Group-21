import { Request, Response, NextFunction } from 'express';
import { LeaderboardService } from '../services/leaderboard.service';
import { successResponse } from '../utils/response';

export class LeaderboardController {
    private leaderboardService: LeaderboardService;

    constructor(leaderboardService?: LeaderboardService) {
        this.leaderboardService = leaderboardService || new LeaderboardService();
    }

    getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const leaderboard = await this.leaderboardService.getGlobalLeaderboard(limit);
            res.json(successResponse(leaderboard));
        } catch (error) {
            next(error);
        }
    };
}
