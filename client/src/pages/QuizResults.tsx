import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { QuizAttempt, Quiz } from "@/types/quiz";
import { attemptService } from "@/services/api/attempt.service";
import { quizService } from "@/services/api/quiz.service";
import { CheckCircle2, XCircle, Award, Home, Loader2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function QuizResults() {
  const navigate = useNavigate();
  const { id } = useParams();
  // const { user } = useAuth(); // unused
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadResults();
    }
  }, [id]);

  const loadResults = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const attemptData = await attemptService.getById(id);
      setAttempt(attemptData);

      // Load quiz details
      const quizData = await quizService.getById(attemptData.quizId);
      setQuiz(quizData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load results");
      navigate("/student/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!attempt || !quiz) {
    return null;
  }

  const percentage = ((attempt.score / attempt.totalQuestions) * 100).toFixed(1);
  const passed = parseFloat(percentage) >= 60;

  const getResultMessage = () => {
    const score = parseFloat(percentage);
    if (score >= 90) return { title: "Excellent!", message: "Outstanding performance!" };
    if (score >= 80) return { title: "Great Job!", message: "You did really well!" };
    if (score >= 70) return { title: "Good Work!", message: "Nice effort!" };
    if (score >= 60) return { title: "Passed!", message: "You passed the quiz!" };
    return { title: "Keep Trying!", message: "Review and try again!" };
  };

  const result = getResultMessage();

  const getQuestionResult = (questionId: string) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) return null;

    const attemptAnswer = attempt.answers.find((a) => a.questionId === questionId);
    const selectedOption = question.options.find((o) => o.id === attemptAnswer?.optionId);
    const correctOption = question.options.find((o) => o.isCorrect);

    return {
      question,
      selectedOption,
      correctOption,
      isCorrect: selectedOption?.isCorrect || false,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Quiz Results
            </h1>
            <Button variant="ghost" onClick={() => navigate("/student/dashboard")}>
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Results Summary */}
          <Card
            className={`border-2 ${passed ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}
          >
            <CardContent className="py-8 text-center">
              <div className="mb-4">
                {passed ? (
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                ) : (
                  <Award className="w-16 h-16 text-yellow-600 mx-auto" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {result.title}
              </h2>
              <p className="text-lg text-gray-700 mb-6">{result.message}</p>

              <div className="flex items-center justify-center gap-8 mb-6">
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {percentage}%
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div>
                  <div className="text-4xl font-bold text-gray-900">
                    {attempt.score}/{attempt.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate(`/student/quiz/${quiz.id}/take`)} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button onClick={() => navigate("/student/dashboard")}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Review Answers
            </h3>
            <div className="space-y-4">
              {quiz.questions.map((question, index) => {
                const questionResult = getQuestionResult(question.id || "");
                if (!questionResult) return null;

                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span>Question {index + 1}</span>
                            {questionResult.isCorrect ? (
                              <Badge className="bg-green-600">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Correct
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="w-3 h-3 mr-1" />
                                Incorrect
                              </Badge>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-900 font-medium">
                        {question.text}
                      </p>

                      <div className="space-y-2">
                        {question.options.map((option) => {
                          const isSelected = questionResult.selectedOption?.id === option.id;
                          const isCorrect = option.isCorrect;

                          return (
                            <div
                              key={option.id}
                              className={`p-3 rounded-lg border-2 ${isCorrect
                                ? "border-green-500 bg-green-50"
                                : isSelected
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200 bg-white"
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={isCorrect || isSelected ? "font-medium" : ""}
                                >
                                  {option.text}
                                </span>
                                {isCorrect && (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                )}
                                {isSelected && !isCorrect && (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                              </div>
                              {isCorrect && (
                                <p className="text-sm text-green-700 mt-1">
                                  Correct Answer
                                </p>
                              )}
                              {isSelected && !isCorrect && (
                                <p className="text-sm text-red-700 mt-1">
                                  Your Answer
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
