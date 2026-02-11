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
import type { Quiz, QuizAttempt } from "@/types/quiz";
import { quizService } from "@/services/api/quiz.service";
import { attemptService } from "@/services/api/attempt.service";
import {
  BookOpen,
  LogOut,
  PlayCircle,
  Trophy,
  Clock,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quizzesData, attemptsData] = await Promise.all([
        quizService.getAll(),
        attemptService.getMyAttempts(),
      ]);
      setQuizzes(quizzesData);
      setAttempts(attemptsData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getQuizAttempts = (quizId: string) => {
    return attempts.filter((a) => a.quizId === quizId);
  };

  const getBestScore = (quizId: string) => {
    const quizAttempts = getQuizAttempts(quizId);
    if (quizAttempts.length === 0) return null;
    return Math.max(...quizAttempts.map((a) => (a.score / a.totalQuestions) * 100));
  };

  const getAverageScore = () => {
    if (attempts.length === 0) return 0;
    const total = attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0);
    return (total / attempts.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome, {user?.username}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Available Quizzes
              </CardTitle>
              <BookOpen className="w-4 h-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{quizzes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Quizzes Taken
              </CardTitle>
              <Trophy className="w-4 h-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{attempts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Average Score
              </CardTitle>
              <Trophy className="w-4 h-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAverageScore()}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart attempts={attempts} />
        </div>

        {/* Available Quizzes */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Quizzes
            </h2>
            <p className="text-gray-600 mt-1">Take a quiz to test your knowledge</p>
          </div>

          {quizzes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No quizzes available
                </h3>
                <p className="text-gray-600">
                  Check back later for new quizzes
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => {
                const quizAttempts = getQuizAttempts(quiz.id);
                const bestScore = getBestScore(quiz.id);
                return (
                  <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{quiz.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {quiz.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">
                            {quiz.questions.length}{" "}
                            {quiz.questions.length === 1 ? "Question" : "Questions"}
                          </Badge>
                          {quizAttempts.length > 0 && (
                            <Badge variant="outline">
                              {quizAttempts.length}{" "}
                              {quizAttempts.length === 1 ? "Attempt" : "Attempts"}
                            </Badge>
                          )}
                          {bestScore !== null && (
                            <Badge className="bg-green-600">
                              Best: {bestScore.toFixed(0)}%
                            </Badge>
                          )}
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => navigate(`/student/quiz/${quiz.id}/take`)}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {quizAttempts.length > 0 ? "Retake Quiz" : "Take Quiz"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Attempts
              </h2>
              <p className="text-gray-600 mt-1">Your quiz history</p>
            </div>

            <div className="space-y-4">
              {attempts.slice(0, 5).map((attempt) => {
                const percentage = ((attempt.score / attempt.totalQuestions) * 100).toFixed(0);
                const passed = parseFloat(percentage) >= 60;
                return (
                  <Card key={attempt.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {attempt.quiz?.title || "Quiz"}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(attempt.submittedAt).toLocaleDateString()}
                            </span>
                            <span>
                              Score: {attempt.score}/{attempt.totalQuestions}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={passed ? "bg-green-600" : "bg-yellow-600"}>
                            {percentage}%
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/student/attempt/${attempt.id}/results`)}
                          >
                            View Results
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
