import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Trophy,
    Loader2,
    ArrowLeft,
    Medal,
    Users
} from "lucide-react";
import { leaderboardService } from "@/services/api/leaderboard.service";
import type { LeaderboardEntry } from "@/services/api/leaderboard.service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function Leaderboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await leaderboardService.getLeaderboard();
            setLeaderboard(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to load leaderboard");
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Medal className="w-6 h-6 text-yellow-500" />;
            case 1:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 2:
                return <Medal className="w-6 h-6 text-amber-600" />;
            default:
                return <span className="text-gray-500 font-bold ml-1">{index + 1}</span>;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading global rankings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate(user?.role?.toLowerCase() === 'admin' ? '/admin/dashboard' : '/student/dashboard')}
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Trophy className="text-yellow-500 w-8 h-8" />
                                Global Leaderboard
                            </h1>
                            <p className="text-gray-600">Top performers across all quizzes</p>
                        </div>
                    </div>
                    <Button onClick={loadLeaderboard} variant="outline" size="sm">
                        Refresh
                    </Button>
                </div>

                {/* Top 3 Podium (Optional/Visual) */}
                {leaderboard.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {leaderboard.slice(0, 3).map((entry, index) => (
                            <Card key={entry.userId} className={`border-2 ${index === 0 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100'}`}>
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto mb-2 flex justify-center">
                                        {getRankIcon(index)}
                                    </div>
                                    <CardTitle className="text-lg truncate">{entry.username}</CardTitle>
                                    <CardDescription>{entry.totalScore} Points</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center pt-0">
                                    <Badge variant="secondary" className="mt-2">
                                        {entry.averagePercentage}% Avg
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Full Leaderboard Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            Rankings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        <th className="px-4 py-3">Rank</th>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3 text-right">Quizzes</th>
                                        <th className="px-4 py-3 text-right">Avg %</th>
                                        <th className="px-4 py-3 text-right">Total Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {leaderboard.map((entry, index) => (
                                        <tr
                                            key={entry.userId}
                                            className={`hover:bg-gray-50 transition-colors ${entry.userId === user?.id ? 'bg-indigo-50' : ''}`}
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {getRankIcon(index)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${entry.userId === user?.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                                                        {entry.username}
                                                    </span>
                                                    {entry.userId === user?.id && (
                                                        <Badge variant="outline" className="text-[10px] h-4 bg-white">You</Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-right text-gray-600">
                                                {entry.quizzesAttempted}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <span className="font-semibold text-gray-700">{entry.averagePercentage}%</span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <Badge className="bg-indigo-600 text-white font-bold">
                                                    {entry.totalScore}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {leaderboard.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                                No scores recorded yet. Be the first to take a quiz!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
