# 🧩 Mind Maze

> A full-stack daily puzzle web application where users solve a new deterministic logic puzzle every day, earn points, maintain streaks, and compete on a global leaderboard.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Folder Structure](#-folder-structure)
- [Available Scripts](#-available-scripts)
- [Puzzle Engine](#-puzzle-engine)
- [Authentication Flow](#-authentication-flow)
- [License](#-license)

---

## 🚀 Project Overview

**Mind Maze** generates a fresh logic puzzle every day using a deterministic seed derived from the current date. All puzzle generation and validation happens **client-side** — the backend is responsible only for authentication, score persistence, and leaderboard aggregation.

Players can sign in with **Google OAuth 2.0**, **Truecaller**, or continue as a **guest**. Offline progress is stored in the browser via **IndexedDB** and synced to the cloud when a connection is available.

---

## ✨ Key Features

| Feature                     | Description                                                      |
| --------------------------- | ---------------------------------------------------------------- |
| 🧠 Daily Puzzles            | A new deterministic puzzle generated every day from a date seed   |
| 🔥 Streak Tracking          | Consecutive daily completion streaks with persistence             |
| 🏆 Global Leaderboard       | Daily and all-time rankings for top 100 players                  |
| 🔐 Multi-Auth               | Google OAuth 2.0, Truecaller, and guest login modes              |
| 💾 Offline-First            | Native IndexedDB storage — play without an internet connection   |
| ⏱️ Timed Challenges         | Solve time tracked and factored into scoring                     |
| 💡 Hint System              | Limited hints per puzzle with usage tracking                     |
| 📊 Player Profiles          | Stats, activity heatmap, solve history, and streak dashboard     |
| 🎨 Responsive Design        | Mobile-first UI with smooth Framer Motion animations             |

---

## 🏗 Architecture

```
┌───────────────────────────────────────────────────┐
│                   FRONTEND (React)                │
│                                                   │
│  ┌─────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ Puzzle      │  │ Redux      │  │ IndexedDB  │ │
│  │ Engine      │  │ Store      │  │ (offline)  │ │
│  │ (generator, │  │ (user,     │  │            │ │
│  │  validator) │  │  puzzle,   │  │            │ │
│  │             │  │  streak)   │  │            │ │
│  └─────────────┘  └─────┬──────┘  └────────────┘ │
│                         │                         │
└─────────────────────────┼─────────────────────────┘
                          │  HTTP / JSON
                          ▼
┌───────────────────────────────────────────────────┐
│                BACKEND (Express.js)               │
│                                                   │
│  ┌──────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Auth     │  │ Score        │  │ Leaderboard │ │
│  │ Routes   │  │ Routes       │  │ Routes      │ │
│  └────┬─────┘  └──────┬───────┘  └──────┬──────┘ │
│       │               │                 │         │
│       └───────────┬────┴─────────────────┘         │
│                   ▼                               │
│           ┌──────────────┐                        │
│           │ Prisma ORM   │                        │
│           └──────┬───────┘                        │
│                  │                                │
└──────────────────┼────────────────────────────────┘
                   ▼
          ┌────────────────┐
          │  PostgreSQL    │
          │  (Neon / local)│
          └────────────────┘
```

---

## 🛠 Tech Stack

### Frontend

| Layer            | Technology                          | Version  |
| ---------------- | ----------------------------------- | -------- |
| Framework        | React                               | 19.2     |
| Build Tool       | Vite                                | 8.0      |
| State Management | Redux Toolkit + React-Redux         | 2.11 / 9.2 |
| Routing          | React Router DOM                    | 7.14     |
| Styling          | Tailwind CSS + Styled Components    | 4.2 / 6.4 |
| Animations       | Framer Motion                       | 12.38    |
| Date Handling    | Day.js                              | 1.11     |
| Crypto / Seeding | CryptoJS                            | 4.2      |
| Offline Storage  | Native IndexedDB (no wrapper lib)   | —        |
| Linting          | ESLint                              | 10.2     |

### Backend

| Layer            | Technology                          | Version  |
| ---------------- | ----------------------------------- | -------- |
| Runtime          | Node.js                             | 18+      |
| Framework        | Express.js                          | 4.21     |
| ORM              | Prisma Client                       | 5.22     |
| Database         | PostgreSQL (Neon serverless)        | —        |
| Authentication   | JSON Web Tokens (jsonwebtoken)      | 9.0      |
| Google Auth      | google-auth-library                 | 9.14     |
| ID Generation    | uuid                                | 10.0     |
| Environment      | dotenv                              | 16.4     |
| CORS             | cors                                | 2.8      |

---

## 📌 Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later
- **PostgreSQL** database (local or cloud — [Neon](https://neon.tech) recommended)
- **Google Cloud Console** project with OAuth 2.0 credentials (for Google Sign-In)

---

## 🏁 Getting Started

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create your .env file (see Environment Variables section below)
# Then generate Prisma client, push schema, and seed the database:
npm run setup

# Start the development server
npm run dev
```

The backend API will be available at **http://localhost:4000**.  
Verify with: **http://localhost:4000/health**

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create your .env file (see Environment Variables section below)

# Start the Vite development server
npm run dev
```

The frontend will be available at **http://localhost:5173**.  
The Vite dev server proxies all `/api` requests to `http://localhost:4000`.

---

## 🔐 Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000
VITE_CRYPTO_SECRET=logic-looper-daily-seed-secret-2024
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

| Variable              | Description                                         |
| --------------------- | --------------------------------------------------- |
| `VITE_API_URL`        | Base URL for the backend API                        |
| `VITE_CRYPTO_SECRET`  | Secret key used for deterministic daily seed hashing|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID                       |

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
TRUECALLER_CLIENT_ID=your-truecaller-client-id
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

| Variable               | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string (Neon / local)           |
| `JWT_SECRET`           | Secret key for signing JWT tokens                    |
| `GOOGLE_CLIENT_ID`     | Google OAuth 2.0 client ID                           |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret                       |
| `TRUECALLER_CLIENT_ID` | Truecaller OAuth client ID                           |
| `PORT`                 | Server port (defaults to `4000`)                     |
| `CORS_ORIGIN`          | Allowed CORS origin (defaults to `http://localhost:5173`) |

---

## 📡 API Endpoints

All endpoints are prefixed from the server root. The Vite dev proxy rewrites `/api/*` → `http://localhost:4000/*`.

### 🔑 Authentication — `/auth`

| Method | Endpoint            | Auth     | Description                                    |
| ------ | ------------------- | -------- | ---------------------------------------------- |
| POST   | `/auth/google`      | Public   | Sign in with a Google ID token                 |
| POST   | `/auth/truecaller`  | Public   | Sign in with a Truecaller access token         |
| POST   | `/auth/guest`       | Public   | Create or retrieve a guest session             |
| GET    | `/auth/profile`     | Bearer   | Get the authenticated user's profile and stats |

<details>
<summary><strong>POST /auth/google</strong> — Request & Response</summary>

**Request Body:**
```json
{
  "idToken": "google-id-token-string"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "uuid",
    "email": "user@gmail.com",
    "name": "John Doe",
    "avatar": "https://...",
    "streakCount": 5,
    "totalPoints": 2400
  }
}
```
</details>

<details>
<summary><strong>POST /auth/guest</strong> — Request & Response</summary>

**Request Body:**
```json
{
  "guestId": "optional-existing-guest-uuid"
}
```

**Response (200):**
```json
{
  "token": "jwt-token-string",
  "user": {
    "id": "uuid",
    "email": "guest-uuid@guest.logiclooper",
    "name": "Guest Player",
    "streakCount": 0,
    "totalPoints": 0
  }
}
```
</details>

### 📊 Score — `/score`

| Method | Endpoint         | Auth     | Description                                          |
| ------ | ---------------- | -------- | ---------------------------------------------------- |
| POST   | `/score/submit`  | Bearer   | Submit a daily puzzle score (one submission per day)  |

<details>
<summary><strong>POST /score/submit</strong> — Request & Response</summary>

**Request Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "puzzleId": "2026-05-10-logicGrid",
  "score": 850,
  "timeTaken": 42
}
```

**Response (200):**
```json
{
  "message": "Score submitted successfully",
  "dailyScore": {
    "id": "uuid",
    "score": 850,
    "timeTaken": 42,
    "date": "2026-05-10"
  },
  "updatedStats": {
    "totalPoints": 3250,
    "streakCount": 6,
    "puzzlesSolved": 13
  }
}
```
</details>

### 🏆 Leaderboard — `/leaderboard`

| Method | Endpoint               | Auth     | Description                              |
| ------ | ---------------------- | -------- | ---------------------------------------- |
| GET    | `/leaderboard/daily`   | Public   | Get today's top 100 scores               |
| GET    | `/leaderboard/alltime` | Public   | Get all-time top 100 users by total points |

<details>
<summary><strong>GET /leaderboard/daily</strong> — Response</summary>

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "name": "Alice",
      "avatar": "https://...",
      "score": 980,
      "timeTaken": 25
    }
  ],
  "date": "2026-05-10"
}
```
</details>

### 💚 Health Check

| Method | Endpoint  | Auth   | Description                              |
| ------ | --------- | ------ | ---------------------------------------- |
| GET    | `/health` | Public | Check server status and database health  |

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-05-10T09:30:00.000Z",
  "database": "connected"
}
```

---

## 🗄 Database Schema

The application uses **PostgreSQL** with **Prisma ORM**. Three models define the data layer:

### Entity Relationship

```
┌──────────────────┐       1:1       ┌──────────────────┐
│      User        │────────────────▶│   UserStats      │
│                  │                 │                  │
│  id (UUID)       │                 │  puzzlesSolved   │
│  email (unique)  │                 │  avgSolveTime    │
│  name            │                 └──────────────────┘
│  avatar          │
│  streakCount     │       1:N       ┌──────────────────┐
│  totalPoints     │────────────────▶│   DailyScore     │
│  lastPlayed      │                 │                  │
│  createdAt       │                 │  date            │
│  updatedAt       │                 │  puzzleId        │
└──────────────────┘                 │  score           │
                                     │  timeTaken       │
                                     │  ── unique on    │
                                     │  (userId + date) │
                                     └──────────────────┘
```

### Models

| Model        | Table          | Key Fields                                              |
| ------------ | -------------- | ------------------------------------------------------- |
| `User`       | `users`        | `id`, `email` (unique), `name`, `avatar`, `streakCount`, `totalPoints`, `lastPlayed` |
| `UserStats`  | `user_stats`   | `id`, `userId` (unique FK), `puzzlesSolved`, `avgSolveTime` |
| `DailyScore` | `daily_scores` | `id`, `userId` (FK), `date`, `puzzleId`, `score`, `timeTaken` — unique on `(userId, date)` |

---

## 📂 Folder Structure

```
Mind Maze/
│
├── frontend/                          # React SPA (Vite)
│   ├── .env                           # Environment variables
│   ├── index.html                     # HTML entry point (loads Google GSI script)
│   ├── vite.config.js                 # Vite config — Tailwind plugin + API proxy
│   ├── eslint.config.js               # ESLint configuration
│   ├── package.json                   # Dependencies and scripts
│   ├── public/                        # Static public assets
│   └── src/
│       ├── main.jsx                   # App bootstrap — Redux Provider, BrowserRouter
│       ├── App.jsx                    # Root component (Vite scaffold)
│       ├── App.css                    # Global app styles
│       ├── index.css                  # Base CSS reset
│       │
│       ├── app/                       # Redux store
│       │   ├── store.js               # configureStore with all slices
│       │   └── slices/
│       │       ├── userSlice.js       # Auth state, user profile, login/logout
│       │       ├── puzzleSlice.js     # Current puzzle state and progress
│       │       └── streakSlice.js     # Streak tracking and persistence
│       │
│       ├── components/                # Reusable UI components
│       │   ├── Navbar.jsx             # Top navigation bar with auth status
│       │   ├── PuzzleBoard.jsx        # Main puzzle grid and interaction logic
│       │   ├── Timer.jsx              # Countdown / elapsed time display
│       │   ├── HintButton.jsx         # Hint reveal with usage limits
│       │   └── Heatmap.jsx            # Activity heatmap for profile page
│       │
│       ├── pages/                     # Route-level page components
│       │   ├── Home.jsx               # Landing page
│       │   ├── Auth.jsx               # Login page (Google, Truecaller, guest)
│       │   ├── Play.jsx               # Daily puzzle gameplay
│       │   ├── Results.jsx            # Post-solve results and stats
│       │   ├── Profile.jsx            # User profile, history, and heatmap
│       │   └── Leaderboard.jsx        # Daily and all-time leaderboard views
│       │
│       ├── puzzles/                   # Client-side puzzle engine
│       │   ├── generator.js           # Deterministic puzzle generator (seeded)
│       │   ├── validator.js           # Answer validation logic
│       │   └── types/                 # Individual puzzle type definitions
│       │       ├── logicGrid.js       # Logic grid puzzle
│       │       ├── pattern.js         # Pattern recognition puzzle
│       │       ├── sequence.js        # Number / symbol sequence puzzle
│       │       └── syllogism.js       # Syllogism and deduction puzzle
│       │
│       ├── utils/                     # Shared utility functions
│       │   ├── crypto.js              # CryptoJS helpers for seed hashing
│       │   ├── dateSeed.js            # Generate deterministic seed from date
│       │   └── indexedDB.js           # IndexedDB wrapper for offline storage
│       │
│       ├── styles/
│       │   └── index.css              # Shared / additional CSS
│       │
│       └── assets/                    # Static images and SVGs
│           ├── hero.png
│           ├── react.svg
│           └── vite.svg
│
└── backend/                           # Express.js REST API
    ├── .env                           # Environment variables
    ├── package.json                   # Dependencies and scripts
    ├── server.js                      # Server entry point — starts listening
    ├── app.js                         # Express app — middleware, routes, error handling
    │
    ├── controllers/                   # Business logic handlers
    │   ├── authController.js          # Google / Truecaller / guest auth logic
    │   ├── scoreController.js         # Score submission and stats update
    │   └── leaderboardController.js   # Daily and all-time leaderboard queries
    │
    ├── routes/                        # API route definitions
    │   ├── auth.js                    # /auth routes
    │   ├── score.js                   # /score routes (protected)
    │   └── leaderboard.js             # /leaderboard routes
    │
    ├── middleware/                     # Custom middleware
    │   └── authMiddleware.js          # JWT verification + optional auth
    │
    └── prisma/                        # Prisma ORM + database
        ├── schema.prisma              # Database schema definition
        ├── seed.js                    # Seed script (demo user + scores)
        └── migrations/
            └── 20260503144231_init/
                └── migration.sql      # Initial SQL migration
```

---

## 📜 Available Scripts

### Frontend (`frontend/`)

| Command             | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Start Vite dev server with HMR at `localhost:5173`   |
| `npm run build`     | Create optimized production build in `dist/`         |
| `npm run preview`   | Preview the production build locally                 |
| `npm run lint`      | Run ESLint checks across the project                 |

### Backend (`backend/`)

| Command                  | Description                                           |
| ------------------------ | ----------------------------------------------------- |
| `npm run dev`            | Start the Express server (port 4000)                  |
| `npm start`              | Alias for `npm run dev` (production entry)            |
| `npm run prisma:generate`| Generate Prisma Client from schema                   |
| `npm run prisma:migrate` | Create and run a new database migration              |
| `npm run prisma:push`    | Push the schema directly to the database             |
| `npm run prisma:seed`    | Seed the database with demo data                     |
| `npm run setup`          | Run generate → push → seed in one command            |

---

## 🧠 Puzzle Engine

The puzzle engine runs **entirely on the client**. No puzzle data is stored on or fetched from the server.

### How It Works

1. **Seed Generation** — `dateSeed.js` creates a deterministic hash from today's date and the `VITE_CRYPTO_SECRET` using CryptoJS.
2. **Puzzle Selection** — `generator.js` uses the seed to select one of four puzzle types and generate a unique puzzle instance.
3. **Answer Validation** — `validator.js` checks the player's answer against the generated solution on the client side.

### Puzzle Types

| Type               | File              | Description                                    |
| ------------------ | ----------------- | ---------------------------------------------- |
| Logic Grid         | `logicGrid.js`    | Classic logic grid deduction puzzle            |
| Pattern Recognition| `pattern.js`      | Identify the next element in a visual pattern  |
| Sequence           | `sequence.js`     | Find the rule in a number or symbol sequence   |
| Syllogism          | `syllogism.js`    | Draw conclusions from logical premises         |

### Deterministic Guarantee

Given the same date and the same `VITE_CRYPTO_SECRET`, every user worldwide will receive the **exact same puzzle**. This ensures fair competition on the daily leaderboard.

---

## 🔒 Authentication Flow

```
┌──────────┐     ID Token      ┌──────────┐     Verify Token     ┌─────────────┐
│  Google  │  ───────────────▶ │ Frontend │  ──────────────────▶ │   Backend   │
│  OAuth   │                   │          │                      │             │
└──────────┘                   │          │  ◀── JWT + User ──── │  /auth/*    │
                               │          │                      │             │
                               │  Store   │                      │  Prisma     │
                               │  in      │                      │  upsert     │
                               │  Redux   │                      │  user       │
                               └──────────┘                      └─────────────┘

Guest Flow:
  1. Frontend generates a UUID (or reuses one from IndexedDB)
  2. POST /auth/guest { guestId }
  3. Backend upserts a guest user and returns a JWT
  4. All subsequent requests use the JWT in Authorization header
```

### Middleware

- **`authMiddleware`** — Requires a valid `Bearer` token. Returns `401` if missing or invalid.
- **`optionalAuth`** — Attaches user to the request if a valid token exists, otherwise sets `req.user = null` and continues.

---

## 🗺 Route Map

| Path            | Page Component    | Description                          |
| --------------- | ----------------- | ------------------------------------ |
| `/`             | `Home.jsx`        | Landing page with hero and CTA      |
| `/play`         | `Play.jsx`        | Daily puzzle gameplay                |
| `/results`      | `Results.jsx`     | Post-solve score and stats           |
| `/profile`      | `Profile.jsx`     | User stats, heatmap, solve history   |
| `/leaderboard`  | `Leaderboard.jsx` | Daily and all-time rankings          |
| `/auth`         | `Auth.jsx`        | Login / registration page            |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is private and not currently published under an open-source license.

---

<p align="center">
  Built with ❤️ using React, Express, Prisma, and PostgreSQL
</p>