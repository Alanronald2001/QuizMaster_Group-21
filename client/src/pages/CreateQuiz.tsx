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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QuizQuestion, QuizOption } from "@/types/quiz";
import { quizService } from "@/services/api/quiz.service";
import type { CreateQuizRequest } from "@/services/api/quiz.service";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Omit<QuizQuestion, 'id'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuiz();
    } else {
      // Start with one empty question
      addQuestion();
    }
  }, [id]);

  const loadQuiz = async () => {
    if (!id) return;
    try {
      setFetching(true);
      const quiz = await quizService.getById(id);
      setTitle(quiz.title);
      setDescription(quiz.description || "");
      setQuestions(quiz.questions.map(q => ({
        text: q.text,
        order: q.order,
        options: q.options.map(o => ({
          text: o.text,
          isCorrect: o.isCorrect,
          order: o.order
        }))
      })));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load quiz");
      navigate("/admin/dashboard");
    } finally {
      setFetching(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: Omit<QuizQuestion, 'id'> = {
      text: "",
      order: questions.length,
      options: [
        { text: "", isCorrect: true, order: 0 },
        { text: "", isCorrect: false, order: 1 },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    // Update order
    updated.forEach((q, i) => q.order = i);
    setQuestions(updated);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updated = [...questions];
    updated[index].text = text;
    setQuestions(updated);
  };

  const addOption = (questionIndex: number) => {
    const updated = [...questions];
    const newOption: QuizOption = {
      text: "",
      isCorrect: false,
      order: updated[questionIndex].options.length,
    };
    updated[questionIndex].options.push(newOption);
    setQuestions(updated);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    const options = updated[questionIndex].options;
    const optionToRemove = options[optionIndex];

    options.splice(optionIndex, 1);

    // Update order
    options.forEach((o, i) => o.order = i);

    // If we removed the correct option, set first option as correct
    if (optionToRemove.isCorrect && options.length > 0) {
      options[0].isCorrect = true;
      toast.info("Correct answer automatically reassigned to first option");
    }

    setQuestions(updated);
  };

  const updateOptionText = (questionIndex: number, optionIndex: number, text: string) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].text = text;
    setQuestions(updated);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options.forEach((o, i) => {
      o.isCorrect = i === optionIndex;
    });
    setQuestions(updated);
  };

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      if (!question.text.trim()) {
        toast.error(`Please enter text for question ${i + 1}`);
        return;
      }

      if (question.options.length < 2) {
        toast.error(`Question ${i + 1} must have at least 2 options`);
        return;
      }

      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text.trim()) {
          toast.error(`Please enter text for option ${j + 1} in question ${i + 1}`);
          return;
        }
      }

      const hasCorrectAnswer = question.options.some((o) => o.isCorrect);
      if (!hasCorrectAnswer) {
        toast.error(`Please select a correct answer for question ${i + 1}`);
        return;
      }
    }

    const quizData: CreateQuizRequest = {
      title,
      description: description.trim() || undefined,
      questions,
    };

    try {
      setLoading(true);
      if (id) {
        await quizService.update(id, quizData);
        toast.success("Quiz updated successfully");
      } else {
        await quizService.create(quizData);
        toast.success("Quiz created successfully");
      }
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save quiz");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} disabled={loading}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : id ? "Update Quiz" : "Save Quiz"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Quiz Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {id ? "Edit Quiz" : "Create New Quiz"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter quiz title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter quiz description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Questions</h2>
              <Button onClick={addQuestion} variant="outline" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>

            {questions.map((question, qIndex) => (
              <Card key={qIndex}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Question {qIndex + 1}
                    </CardTitle>
                    {questions.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(qIndex)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Question Text *</Label>
                    <Input
                      placeholder="Enter question text"
                      value={question.text}
                      onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>
                        Options (Click the radio button to set correct answer) *
                      </Label>
                      <span className="text-sm text-gray-500">
                        {question.options.find((o) => o.isCorrect) ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Correct answer selected
                          </span>
                        ) : (
                          <span className="text-amber-600">
                            No correct answer selected
                          </span>
                        )}
                      </span>
                    </div>
                    <RadioGroup
                      value={question.options.findIndex((o) => o.isCorrect).toString()}
                      onValueChange={(value) => setCorrectOption(qIndex, parseInt(value))}
                    >
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${option.isCorrect
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 bg-white"
                            }`}
                        >
                          <RadioGroupItem
                            value={oIndex.toString()}
                            id={`q${qIndex}-o${oIndex}`}
                            disabled={loading}
                          />
                          <div className="flex-1 flex items-center gap-2">
                            <Input
                              placeholder={`Option ${oIndex + 1}`}
                              value={option.text}
                              onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                              className={option.isCorrect ? "border-green-300" : ""}
                              disabled={loading}
                            />
                            {option.isCorrect && (
                              <div className="flex items-center gap-1 text-green-600 text-sm font-medium flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                                Correct
                              </div>
                            )}
                            {question.options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(qIndex, oIndex)}
                                title="Delete option"
                                disabled={loading}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addOption(qIndex)}
                      disabled={loading}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
