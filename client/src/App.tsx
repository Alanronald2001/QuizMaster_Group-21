import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Toaster } from "sonner";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import StudentDashboard from "@/pages/StudentDashboard";
import CreateQuiz from "@/pages/CreateQuiz";
import TakeQuiz from "@/pages/TakeQuiz";
import QuizResults from "@/pages/QuizResults";
import QuizAttempts from "@/pages/QuizAttempts";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quiz/create"
            element={
              <ProtectedRoute requireAdmin>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quiz/edit/:id"
            element={
              <ProtectedRoute requireAdmin>
                <CreateQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quiz/:quizId/attempts"
            element={
              <ProtectedRoute requireAdmin>
                <QuizAttempts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attempts"
            element={
              <ProtectedRoute requireAdmin>
                <QuizAttempts />
              </ProtectedRoute>
            }
          />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requireStudent>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/quiz/:id/take"
            element={
              <ProtectedRoute requireStudent>
                <TakeQuiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attempt/:id/results"
            element={
              <ProtectedRoute requireStudent>
                <QuizResults />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
