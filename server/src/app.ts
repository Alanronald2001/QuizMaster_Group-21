import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import quizRoutes from "./routes/quiz.routes";
import attemptRoutes from "./routes/attempt.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", attemptRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
