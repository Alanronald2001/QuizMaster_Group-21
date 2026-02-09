# Design Patterns Used in QuizMaster Server

This document outlines the various design patterns implemented in the QuizMaster server application.

---

## 1. **Layered Architecture (N-Tier Architecture)**

The application follows a clear separation of concerns with distinct layers:

```
┌─────────────────────┐
│   Routes Layer      │  ← HTTP routing
├─────────────────────┤
│  Controllers Layer  │  ← Request/Response handling
├─────────────────────┤
│   Services Layer    │  ← Business logic
├─────────────────────┤
│ Repositories Layer  │  ← Data access
├─────────────────────┤
│   Database (Prisma) │  ← Data persistence
└─────────────────────┘
```

**Implementation:**
- **Routes** (`routes/`) - Define API endpoints
- **Controllers** (`controllers/`) - Handle HTTP requests/responses
- **Services** (`services/`) - Contain business logic
- **Repositories** (`repositories/`) - Manage database operations

**Benefits:**
- Clear separation of concerns
- Easy to test each layer independently
- Maintainable and scalable codebase

---

## 2. **Repository Pattern**

Abstracts data access logic and provides a clean interface for data operations.

**Example:** `repositories/user.repository.ts`

```typescript
export interface IUserRepository {
    create(data: {...}): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
    // Implementation details
}
```

**Benefits:**
- Decouples business logic from data access
- Makes it easier to switch databases or ORMs
- Enables dependency injection for testing
- Centralizes data access logic

**Files:**
- `repositories/user.repository.ts`
- `repositories/quiz.repository.ts`
- `repositories/attempt.repository.ts`

---

## 3. **Dependency Injection (DI)**

Services accept repository instances through constructor injection, allowing for loose coupling and testability.

**Example:** `services/quiz.service.ts`

```typescript
export class QuizService {
    private quizRepository: IQuizRepository;

    constructor(quizRepository?: IQuizRepository) {
        this.quizRepository = quizRepository || new QuizRepository();
    }
    // ...
}
```

**Benefits:**
- Enables unit testing with mock repositories
- Reduces tight coupling between components
- Makes code more flexible and maintainable

---

## 4. **Data Transfer Object (DTO) Pattern**

Uses DTOs with validation schemas to transfer data between layers and validate input.

**Example:** `dtos/auth.dto.ts`

```typescript
export const RegisterSchema = z.object({
    username: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(6),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;
```

**Benefits:**
- Ensures data validation at the entry point
- Provides type safety
- Decouples internal models from API contracts
- Clear contract between client and server

**Files:**
- `dtos/auth.dto.ts`
- `dtos/quiz.dto.ts`
- `dtos/attempt.dto.ts`

---

## 5. **Middleware Pattern (Chain of Responsibility)**

Uses Express middleware to handle cross-cutting concerns in a pipeline.

**Example:** `routes/quiz.routes.ts`

```typescript
router.post('/', 
    authenticate,           // Authentication middleware
    requireAdmin,          // Authorization middleware
    validate(CreateQuizSchema),  // Validation middleware
    quizController.createQuiz    // Controller
);
```

**Middleware Types:**
- **Authentication** (`middlewares/auth.middleware.ts`) - Verifies JWT tokens
- **Authorization** (`middlewares/auth.middleware.ts`) - Checks user roles
- **Validation** (`middlewares/validation.middleware.ts`) - Validates request data
- **Error Handling** (`middlewares/error.middleware.ts`) - Centralized error handling

**Benefits:**
- Separates cross-cutting concerns
- Reusable across different routes
- Clean and readable route definitions

---

## 6. **Factory Pattern (Implicit)**

The validation middleware acts as a factory for creating validation functions.

**Example:** `middlewares/validation.middleware.ts`

```typescript
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Validation logic
    };
};
```

**Usage:**
```typescript
validate(RegisterSchema)  // Creates a validation middleware
```

**Benefits:**
- Reusable validation logic
- Consistent validation across all endpoints

---

## 7. **Singleton Pattern**

Database connection and Prisma client are managed as singletons.

**Example:** `config/database.ts` and `models/prisma.ts`

```typescript
// Single instance of Prisma client shared across the application
const prisma = new PrismaClient();
export default prisma;
```

**Benefits:**
- Prevents multiple database connections
- Efficient resource usage
- Centralized configuration

---

## 8. **Strategy Pattern**

Different error types implement different strategies for error handling.

**Example:** `utils/errors.ts`

```typescript
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) { /* ... */ }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(401, message);
    }
}
```

**Benefits:**
- Different error types with specific HTTP status codes
- Consistent error handling across the application
- Easy to add new error types

---

## 9. **Template Method Pattern**

Controllers follow a template for handling requests.

**Example:** All controller methods follow this pattern:

```typescript
async methodName(req: Request, res: Response, next: NextFunction) {
    try {
        // 1. Extract data from request
        // 2. Call service method
        const result = await service.method(data);
        // 3. Send success response
        res.json(successResponse(result, 'Success message'));
    } catch (error) {
        // 4. Pass error to error handler
        next(error);
    }
}
```

**Benefits:**
- Consistent error handling
- Predictable code structure
- Easy to understand and maintain

---

## 10. **Module Pattern**

Code is organized into modules with clear boundaries and exports.

**Structure:**
```
server/src/
├── config/       # Configuration modules
├── controllers/  # Controller modules
├── services/     # Service modules
├── repositories/ # Repository modules
├── middlewares/  # Middleware modules
├── utils/        # Utility modules
└── types/        # Type definition modules
```

**Benefits:**
- Clear code organization
- Easy to locate functionality
- Prevents naming conflicts

---

## 11. **Decorator Pattern (via Middleware)**

Middleware decorates routes with additional functionality without modifying the core logic.

**Example:**
```typescript
// Base route
router.get('/', quizController.getAllQuizzes);

// Decorated with authentication
router.get('/', authenticate, quizController.getAllQuizzes);

// Decorated with authentication + authorization
router.post('/', authenticate, requireAdmin, quizController.createQuiz);
```

**Benefits:**
- Adds functionality without modifying existing code
- Composable and reusable
- Follows Open/Closed Principle

---

## 12. **Configuration Pattern**

Centralized configuration management with environment variables.

**Example:** `config/env.ts`

```typescript
export const env: EnvConfig = {
    DATABASE_URL: getEnvVar('DATABASE_URL'),
    JWT_SECRET: getEnvVar('JWT_SECRET'),
    JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
    PORT: parseInt(getEnvVar('PORT', '5000'), 10),
    NODE_ENV: getEnvVar('NODE_ENV', 'development'),
};
```

**Benefits:**
- Single source of truth for configuration
- Type-safe configuration
- Easy to manage different environments

---

## 13. **Response Wrapper Pattern**

Standardized API response format across all endpoints.

**Example:** `utils/response.ts`

```typescript
export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => {
    return {
        success: true,
        data,
        message,
    };
};

export const errorResponse = (message: string, error?: string): ApiResponse => {
    return {
        success: false,
        message,
        error,
    };
};
```

**Benefits:**
- Consistent API responses
- Easy for clients to parse
- Clear success/error indication

---

## Summary Table

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Layered Architecture** | Entire codebase | Separation of concerns |
| **Repository** | `repositories/` | Data access abstraction |
| **Dependency Injection** | `services/` | Loose coupling, testability |
| **DTO** | `dtos/` | Data validation & transfer |
| **Middleware** | `middlewares/`, routes | Cross-cutting concerns |
| **Factory** | `middlewares/validation.middleware.ts` | Create validation functions |
| **Singleton** | `config/database.ts` | Single DB connection |
| **Strategy** | `utils/errors.ts` | Different error handling strategies |
| **Template Method** | `controllers/` | Consistent request handling |
| **Module** | Entire structure | Code organization |
| **Decorator** | Middleware chains | Add functionality to routes |
| **Configuration** | `config/env.ts` | Centralized config management |
| **Response Wrapper** | `utils/response.ts` | Standardized API responses |

---

## Best Practices Followed

1. **SOLID Principles**
   - **Single Responsibility**: Each class has one reason to change
   - **Open/Closed**: Open for extension, closed for modification
   - **Dependency Inversion**: Depend on abstractions (interfaces)

2. **DRY (Don't Repeat Yourself)**
   - Reusable middleware
   - Centralized error handling
   - Shared utilities

3. **Separation of Concerns**
   - Clear layer boundaries
   - Each layer has specific responsibilities

4. **Type Safety**
   - TypeScript throughout
   - Zod schemas for runtime validation
   - Interface definitions for contracts

5. **Error Handling**
   - Custom error classes
   - Centralized error middleware
   - Consistent error responses
