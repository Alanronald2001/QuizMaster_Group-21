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
import type { Quiz } from "@/types/quiz";
import { quizService } from "@/services/api/quiz.service";
import type { Answer } from "@/services/api/attempt.service";
import { attemptService } from "@/services/api/attempt.service";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function TakeQuiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadQuiz();
    }
  }, [id]);

  const loadQuiz = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await quizService.getById(id);
      setQuiz(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load quiz");
      navigate("/student/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    try {
      setSubmitting(true);
      const answersArray: Answer[] = Object.entries(answers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));

      const attempt = await attemptService.submit({
        quizId: quiz.id,
        answers: answersArray,
      });

      toast.success("Quiz submitted successfully!");
      navigate(`/student/attempt/${attempt.id}/results`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((Object.keys(answers).length / quiz.questions.length) * 100);
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/student/dashboard")}
              disabled={submitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Quiz Info */}
          <Card>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              {quiz.description && (
                <p className="text-gray-600 mt-2">{quiz.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{Object.keys(answers).length}/{quiz.questions.length} answered</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-900 font-medium text-lg">
                {currentQuestion.text}
              </p>

              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${answers[currentQuestion.id] === option.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      onClick={() => handleAnswerChange(currentQuestion.id, option.id)}
                    >
                      <RadioGroupItem
                        value={option.id}
                        id={option.id}
                        disabled={submitting}
                      />
                      <Label
                        htmlFor={option.id}
                        className="flex-1 cursor-pointer"
                      >
                        {option.text}
                      </Label>
                      {answers[currentQuestion.id] === option.id && (
                        <CheckCircle className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || submitting}
            >
              Previous
            </Button>

            {isLastQuestion ? (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={submitting}>
                Next
              </Button>
            )}
          </div>

          {/* Question Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {quiz.questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    disabled={submitting}
                    className={`aspect-square rounded-lg border-2 font-medium text-sm transition-colors ${index === currentQuestionIndex
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : answers[question.id]
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
