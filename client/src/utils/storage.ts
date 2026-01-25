import type { User, Quiz, QuizAttempt } from "@/types/quiz";

const STORAGE_KEYS = {
  USERS: "quiz_app_users",
  QUIZZES: "quiz_app_quizzes",
  ATTEMPTS: "quiz_app_attempts",
  CURRENT_USER: "quiz_app_current_user",
  INITIALIZED: "quiz_app_initialized",
};

// Initialize with demo users
const initializeUsers = (): User[] => {
  const users: User[] = [
    {
      id: "1",
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      role: "ADMIN",
    },
    {
      id: "2",
      username: "student",
      email: "student@example.com",
      password: "student123",
      role: "STUDENT",
    },
  ];

  const existing = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existing) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  return existing ? JSON.parse(existing) : users;
};

// Initialize with demo quizzes
const initializeMockQuizzes = (): void => {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (initialized) return;

  const mockQuizzes: Quiz[] = [
    {
      id: "quiz-1",
      title: "JavaScript Fundamentals",
      description:
        "Test your knowledge of JavaScript basics including variables, functions, and data types.",
      createdBy: "1",
      createdAt: "2026-01-10T10:00:00.000Z",
      questions: [
        {
          id: "q1-1",
          text: "What is the correct way to declare a variable in JavaScript?",
          options: [
            { id: "q1-1-opt1", text: "var myVar = 5;", isCorrect: true, order: 0 },
            { id: "q1-1-opt2", text: "variable myVar = 5;", isCorrect: false, order: 1 },
            { id: "q1-1-opt3", text: "v myVar = 5;", isCorrect: false, order: 2 },
            { id: "q1-1-opt4", text: "dim myVar = 5;", isCorrect: false, order: 3 },
          ],
        },
        {
          id: "q1-2",
          text: "Which method is used to add an element to the end of an array?",
          options: [
            { id: "q1-2-opt1", text: "array.add()", isCorrect: false },
            { id: "q1-2-opt2", text: "array.push()", isCorrect: true },
            { id: "q1-2-opt3", text: "array.append()", isCorrect: false },
            { id: "q1-2-opt4", text: "array.insert()", isCorrect: false },
          ],
        },
        {
          id: "q1-3",
          text: 'What does the "===" operator do in JavaScript?',
          options: [
            { id: "q1-3-opt1", text: "Assigns a value", isCorrect: false },
            { id: "q1-3-opt2", text: "Compares values only", isCorrect: false },
            {
              id: "q1-3-opt3",
              text: "Compares both value and type",
              isCorrect: true,
            },
          ],
        },
      ],
    },
    {
      id: "quiz-2",
      title: "React Basics",
      description:
        "Evaluate your understanding of React components, hooks, and state management.",
      createdBy: "1",
      createdAt: "2026-01-12T14:30:00.000Z",
      questions: [
        {
          id: "q2-1",
          text: "What hook is used to manage state in a functional component?",
          options: [
            { id: "q2-1-opt1", text: "useEffect", isCorrect: false },
            { id: "q2-1-opt2", text: "useState", isCorrect: true },
            { id: "q2-1-opt3", text: "useContext", isCorrect: false },
            { id: "q2-1-opt4", text: "useReducer", isCorrect: false },
          ],
        },
        {
          id: "q2-2",
          text: "Which method is used to render a React component?",
          options: [
            { id: "q2-2-opt1", text: "ReactDOM.render()", isCorrect: true },
            { id: "q2-2-opt2", text: "React.render()", isCorrect: false },
            { id: "q2-2-opt3", text: "Component.render()", isCorrect: false },
          ],
        },
        {
          id: "q2-3",
          text: "What is JSX?",
          options: [
            { id: "q2-3-opt1", text: "A JavaScript library", isCorrect: false },
            {
              id: "q2-3-opt2",
              text: "A syntax extension for JavaScript",
              isCorrect: true,
            },
            { id: "q2-3-opt3", text: "A CSS framework", isCorrect: false },
            { id: "q2-3-opt4", text: "A testing tool", isCorrect: false },
          ],
        },
        {
          id: "q2-4",
          text: "What does the useEffect hook do?",
          options: [
            {
              id: "q2-4-opt1",
              text: "Manages component state",
              isCorrect: false,
            },
            {
              id: "q2-4-opt2",
              text: "Handles side effects in components",
              isCorrect: true,
            },
            { id: "q2-4-opt3", text: "Creates context", isCorrect: false },
          ],
        },
      ],
    },
    {
      id: "quiz-3",
      title: "Web Development Trivia",
      description:
        "A fun quiz covering HTML, CSS, and general web development concepts.",
      createdBy: "1",
      createdAt: "2026-01-14T09:15:00.000Z",
      questions: [
        {
          id: "q3-1",
          text: "What does HTML stand for?",
          options: [
            {
              id: "q3-1-opt1",
              text: "Hyper Text Markup Language",
              isCorrect: true,
            },
            {
              id: "q3-1-opt2",
              text: "High Tech Modern Language",
              isCorrect: false,
            },
            {
              id: "q3-1-opt3",
              text: "Home Tool Markup Language",
              isCorrect: false,
            },
            {
              id: "q3-1-opt4",
              text: "Hyperlinks and Text Markup Language",
              isCorrect: false,
            },
          ],
        },
        {
          id: "q3-2",
          text: "Which CSS property is used to change text color?",
          options: [
            { id: "q3-2-opt1", text: "text-color", isCorrect: false },
            { id: "q3-2-opt2", text: "font-color", isCorrect: false },
            { id: "q3-2-opt3", text: "color", isCorrect: true },
            { id: "q3-2-opt4", text: "text-style", isCorrect: false },
          ],
        },
        {
          id: "q3-3",
          text: "What is the default display value for a div element?",
          options: [
            { id: "q3-3-opt1", text: "inline", isCorrect: false },
            { id: "q3-3-opt2", text: "block", isCorrect: true },
            { id: "q3-3-opt3", text: "flex", isCorrect: false },
            { id: "q3-3-opt4", text: "grid", isCorrect: false },
            { id: "q3-3-opt5", text: "inline-block", isCorrect: false },
          ],
        },
        {
          id: "q3-4",
          text: 'Which HTTP status code indicates "Not Found"?',
          options: [
            { id: "q3-4-opt1", text: "200", isCorrect: false },
            { id: "q3-4-opt2", text: "404", isCorrect: true },
            { id: "q3-4-opt3", text: "500", isCorrect: false },
            { id: "q3-4-opt4", text: "403", isCorrect: false },
          ],
        },
        {
          id: "q3-5",
          text: "What does CSS stand for?",
          options: [
            {
              id: "q3-5-opt1",
              text: "Computer Style Sheets",
              isCorrect: false,
            },
            {
              id: "q3-5-opt2",
              text: "Cascading Style Sheets",
              isCorrect: true,
            },
            {
              id: "q3-5-opt3",
              text: "Creative Style System",
              isCorrect: false,
            },
          ],
        },
      ],
    },
  ];

  // Add mock quiz attempts for the student user
  const mockAttempts: QuizAttempt[] = [
    {
      id: "attempt-1",
      quizId: "quiz-1",
      quizTitle: "JavaScript Fundamentals",
      userId: "2",
      username: "student",
      role: "student",
      answers: {
        "q1-1": "q1-1-opt1",
        "q1-2": "q1-2-opt2",
        "q1-3": "q1-3-opt2",
      },
      score: 2,
      totalQuestions: 3,
      submittedAt: "2026-01-15T11:30:00.000Z",
    },
    {
      id: "attempt-2",
      quizId: "quiz-2",
      quizTitle: "React Basics",
      userId: "2",
      username: "student",
      role: "student",
      answers: {
        "q2-1": "q2-1-opt2",
        "q2-2": "q2-2-opt1",
        "q2-3": "q2-3-opt2",
        "q2-4": "q2-4-opt2",
      },
      score: 4,
      totalQuestions: 4,
      submittedAt: "2026-01-15T14:20:00.000Z",
    },
  ];

  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(mockQuizzes));
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(mockAttempts));
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
};

// User operations
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : initializeUsers();
};

export const authenticateUser = (
  username: string,
  password: string,
): User | null => {
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
  return user || null;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// Quiz operations
export const getQuizzes = (): Quiz[] => {
  initializeMockQuizzes(); // Initialize mock data on first load
  const quizzes = localStorage.getItem(STORAGE_KEYS.QUIZZES);
  return quizzes ? JSON.parse(quizzes) : [];
};

export const getQuizById = (id: string): Quiz | null => {
  const quizzes = getQuizzes();
  return quizzes.find((q) => q.id === id) || null;
};

export const saveQuiz = (quiz: Quiz): void => {
  const quizzes = getQuizzes();
  const existingIndex = quizzes.findIndex((q) => q.id === quiz.id);

  if (existingIndex >= 0) {
    quizzes[existingIndex] = quiz;
  } else {
    quizzes.push(quiz);
  }

  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
};

export const deleteQuiz = (id: string): void => {
  const quizzes = getQuizzes();
  const filtered = quizzes.filter((q) => q.id !== id);
  localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(filtered));
};

// Attempt operations
export const getAttempts = (): QuizAttempt[] => {
  const attempts = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
  return attempts ? JSON.parse(attempts) : [];
};

export const getAttemptsByQuizId = (quizId: string): QuizAttempt[] => {
  const attempts = getAttempts();
  return attempts.filter((a) => a.quizId === quizId);
};

export const getAttemptsByUserId = (userId: string): QuizAttempt[] => {
  const attempts = getAttempts();
  return attempts.filter((a) => a.userId === userId);
};

export const saveAttempt = (attempt: QuizAttempt): void => {
  const attempts = getAttempts();
  attempts.push(attempt);
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
};

// Utility function to reset all data (useful for testing)
export const resetAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.QUIZZES);
  localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  initializeUsers();
  initializeMockQuizzes();
};
