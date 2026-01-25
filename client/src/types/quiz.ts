// User types aligned with Prisma schema
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  createdAt?: string;
  updatedAt?: string;
  password?: string; // Added for mock storage support
}

// Quiz option
export interface QuizOption {
  id?: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

// Quiz question
export interface QuizQuestion {
  id?: string;
  text: string;
  order: number;
  options: QuizOption[];
}

// Quiz
export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  createdBy?: string;
  questions: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
  creator?: User;
}

// Quiz attempt
export interface QuizAttempt {
  id: string;
  score: number;
  totalQuestions: number;
  userId: string;
  quizId: string;
  submittedAt: string;
  answers: {
    id: string;
    questionId: string;
    optionId: string;
  }[];
  user?: User;
  quiz?: Quiz;
}

// For displaying results
export interface QuizAttemptWithDetails extends QuizAttempt {
  quiz: Quiz;
  user: User;
}
