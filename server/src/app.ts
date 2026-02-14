import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import quizRoutes from "./routes/quiz.routes";
import attemptRoutes from "./routes/attempt.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

// CORS configuration
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow all origins (for development/permanent fix as requested)
            // For credentials to work, origin cannot be '*'
            callback(null, origin || "*");
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(
    helmet({
        contentSecurityPolicy: false, // Disable CSP to avoid CORS conflicts
        crossOriginResourcePolicy: false, // Allow cross-origin requests
    })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
