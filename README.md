# QuizMaster - Full-Stack Quiz Application

A modern, full-stack quiz application built with React, TypeScript, Node.js, Express, and PostgreSQL. Features role-based authentication, quiz management, and comprehensive quiz-taking capabilities.

## 🚀 Features

### For Admins
- Create, edit, and delete quizzes
- Add multiple-choice questions with customizable options
- View all quiz attempts and statistics
- Manage quiz content with real-time validation

### For Students
- Browse available quizzes
- Take quizzes with progress tracking
- View detailed results with answer explanations
- Track quiz history and performance
- Track ranking through leaderboard

### Technical Features
- **JWT Authentication** with role-based authorization
- **RESTful API** following SOLID principles
- **Type-safe** with TypeScript throughout
- **Responsive UI** with modern design
- **Real-time validation** with Zod schemas
- **Secure** password hashing with bcrypt

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd QuizMaster_Group-21
```

### 2. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start server
npm run dev
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install --legacy-peer-deps

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start client
npm run dev
```

Client runs on `http://localhost:5173`

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Shadcn/UI** components
- **TailwindCSS** for styling
- **Context API** for state management

### Backend
- **Express.js** with TypeScript
- **Prisma ORM** for database
- **PostgreSQL** database
- **JWT** for authentication
- **Zod** for validation
- **Bcrypt** for password hashing

### Architecture Pattern
```
Frontend: Components → Services → API
Backend: Controllers → Services → Repositories → Database
```

## 📁 Project Structure

```
QuizMaster_Group-21/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
└── server/                # Backend application
    ├── src/
    │   ├── config/        # Configuration files
    │   ├── controllers/   # Request handlers
    │   ├── dtos/          # Data transfer objects
    │   ├── middlewares/   # Express middlewares
    │   ├── repositories/  # Data access layer
    │   ├── routes/        # API routes
    │   ├── services/      # Business logic
    │   ├── types/         # TypeScript types
    │   └── utils/         # Utility functions
    ├── prisma/
    │   └── schema.prisma  # Database schema
    └── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create quiz (admin)
- `PUT /api/quizzes/:id` - Update quiz (admin)
- `DELETE /api/quizzes/:id` - Delete quiz (admin)

### Attempts
- `POST /api/attempts` - Submit quiz attempt (student)
- `GET /api/attempts/me` - Get my attempts
- `GET /api/attempts/:id` - Get attempt by ID
- `GET /api/attempts/quiz/:quizId` - Get quiz attempts (admin)
- `GET /api/attempts/user/:userId` - Get user attempts (admin)

## 🧪 Testing

### Manual Testing

1. **Register Users:**
   - Create an admin account
   - Create a student account

2. **Admin Workflow:**
   - Login as admin
   - Create a quiz with questions
   - View quiz list
   - Edit/delete quizzes

3. **Student Workflow:**
   - Login as student
   - Browse quizzes
   - Take a quiz
   - View results
   - Check history

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- Role-based authorization (Admin/Student)
- Input validation with Zod schemas
- SQL injection prevention via Prisma ORM
- CORS configuration
- Helmet security headers

## 🎯 SOLID Principles

- **Single Responsibility**: Each class has one clear purpose
- **Open/Closed**: Extensible through dependency injection
- **Liskov Substitution**: Repository interfaces are interchangeable
- **Interface Segregation**: Minimal, focused interfaces
- **Dependency Inversion**: Services depend on abstractions

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/quizmaster"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚧 Future Enhancements

- [ ] Unit and integration tests
- [ ] Refresh token implementation
- [ ] Rate limiting
- [ ] Pagination for lists
- [ ] Quiz categories and tags
- [ ] Advanced analytics dashboard
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Quiz time limits
- [ ] Question randomization

## 👥 Contributors

Group 21

## 📄 License

This project is licensed under the ISC License.
