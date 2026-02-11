import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { QuizAttempt } from "@/types/quiz";
import { attemptService } from "@/services/api/attempt.service";
import { ArrowLeft, Trophy, Clock, User, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function QuizAttempts() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const { isAdmin } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttempts();
  }, [quizId]);

  const loadAttempts = async () => {
    try {
      setLoading(true);
      let data: QuizAttempt[];

      if (quizId) {
        // Load attempts for specific quiz (admin only)
        data = await attemptService.getByQuizId(quizId);
      } else if (isAdmin) {
        // Load all attempts for admin
        data = await attemptService.getAll();
      } else {
        // Load my attempts (student view)
        data = await attemptService.getMyAttempts();
      }

      setAttempts(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load attempts");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  const getAverageScore = () => {
    if (attempts.length === 0) return 0;
    const total = attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0);
    return (total / attempts.length).toFixed(1);
  };

  const getHighestScore = () => {
    if (attempts.length === 0) return 0;
    return Math.max(...attempts.map((a) => (a.score / a.totalQuestions) * 100)).toFixed(0);
  };

  const getLowestScore = () => {
    if (attempts.length === 0) return 0;
    return Math.min(...attempts.map((a) => (a.score / a.totalQuestions) * 100)).toFixed(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading attempts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Quiz Attempts
            </h1>
            <div className="w-20"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {attempts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Total Attempts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attempts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Average Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getAverageScore()}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Highest Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{getHighestScore()}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Lowest Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{getLowestScore()}%</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attempts List */}
        {attempts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No attempts yet
              </h3>
              <p className="text-gray-600">
                {quizId ? "This quiz hasn't been attempted yet" : "No quiz attempts found"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              All Attempts
            </h2>
            {attempts.map((attempt) => {
              const percentage = ((attempt.score / attempt.totalQuestions) * 100).toFixed(0);
              const passed = parseFloat(percentage) >= 60;
              return (
                <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {attempt.quiz?.title || "Quiz"}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          {isAdmin && attempt.user && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {attempt.user.username}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(attempt.submittedAt).toLocaleString()}
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
                        {!isAdmin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/student/attempt/${attempt.id}/results`)}
                          >
                            View Results
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
