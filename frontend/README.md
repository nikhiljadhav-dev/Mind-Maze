# 🧩 Mind Maze

> A full-stack daily puzzle web application where users solve a new deterministic logic puzzle every day, maintain streaks, earn points, and compete on a leaderboard.

---

## 📋 Table of Contents

* [Project Overview](#-project-overview)
* [Key Features](#-key-features)
* [Architecture](#-architecture)
* [Tech Stack](#-tech-stack)
* [Prerequisites](#-prerequisites)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [API Endpoints](#-api-endpoints)
* [Database Schema](#-database-schema)
* [Folder Structure](#-folder-structure)
* [Available Scripts](#-available-scripts)
* [Puzzle Engine](#-puzzle-engine)
* [Authentication Flow](#-authentication-flow)
* [Security Notes](#-security-notes)
* [License](#-license)

---

# 🚀 Project Overview

**Mind Maze** is a full-stack daily puzzle platform built with React, Express, Prisma, and PostgreSQL.

The application generates a deterministic daily puzzle based on the current date so every player receives the same challenge each day.

Players can:

* solve daily puzzles
* track streaks
* earn points
* compete on leaderboards
* play offline with IndexedDB persistence

Authentication supports:

* Google OAuth 2.0
* guest login
* optional third-party authentication providers

---

# ✨ Key Features

* 🧠 Deterministic daily puzzles
* 🔥 Daily streak tracking
* 🏆 Global leaderboard
* 💾 Offline-first gameplay with IndexedDB
* 🔐 JWT authentication
* 📊 User statistics and profiles
* 🎨 Responsive UI with animations
* ⚡ Fast frontend powered by Vite
* 🗄 PostgreSQL + Prisma backend

---

# 🏗 Architecture

```text
Frontend (React + Redux + IndexedDB)
        │
        │ HTTP / JSON
        ▼
Backend (Express.js API)
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL Database
```

---

# 🛠 Tech Stack

## Frontend

* React
* Vite
* Redux Toolkit
* React Router
* Tailwind CSS
* Framer Motion
* IndexedDB
* CryptoJS

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Google OAuth
* dotenv

---

# 📌 Prerequisites

* Node.js v18+
* npm v9+
* PostgreSQL database
* Google OAuth credentials

---

# 🏁 Getting Started

## Backend Setup

```bash
cd backend

npm install

npm run setup

npm run dev
```

Backend runs on:

```text
http://localhost:4000
```

Health check:

```text
http://localhost:4000/health
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

> Never commit real environment variables, database credentials, OAuth secrets, or JWT secrets to version control.

## Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000
VITE_PUZZLE_SEED_NAMESPACE=mind-maze-daily-v1
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

| Variable                     | Description                                               |
| ---------------------------- | --------------------------------------------------------- |
| `VITE_API_URL`               | Backend API base URL                                      |
| `VITE_PUZZLE_SEED_NAMESPACE` | Public namespace used for deterministic puzzle generation |
| `VITE_GOOGLE_CLIENT_ID`      | Google OAuth client ID                                    |

---

## Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE_NAME?sslmode=require
JWT_SECRET=replace-with-long-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

| Variable               | Description                           |
| ---------------------- | ------------------------------------- |
| `DATABASE_URL`         | PostgreSQL database connection string |
| `JWT_SECRET`           | JWT signing secret                    |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret            |
| `PORT`                 | Backend server port                   |
| `CORS_ORIGIN`          | Allowed frontend origin               |

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint        | Description                    |
| ------ | --------------- | ------------------------------ |
| POST   | `/auth/google`  | Login using Google OAuth       |
| POST   | `/auth/guest`   | Guest authentication           |
| GET    | `/auth/profile` | Get authenticated user profile |

---

## Score

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| POST   | `/score/submit` | Submit daily puzzle score |

---

## Leaderboard

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| GET    | `/leaderboard/daily`   | Daily leaderboard    |
| GET    | `/leaderboard/alltime` | All-time leaderboard |

---

## Health

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| GET    | `/health` | Server health check |

---

# 🗄 Database Schema

## Models

### User

* id
* email
* name
* avatar
* streakCount
* totalPoints
* lastPlayed

### UserStats

* userId
* puzzlesSolved
* avgSolveTime

### DailyScore

* userId
* date
* puzzleId
* score
* timeTaken

Unique constraint:

```text
(userId + date)
```

---

# 📂 Folder Structure

```text
Mind Maze/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── prisma/
│   ├── package.json
│   └── server.js
│
└── README.md
```

---

# 📜 Available Scripts

## Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Backend

```bash
npm run dev
npm run prisma:generate
npm run prisma:migrate
npm run prisma:push
npm run prisma:seed
npm run setup
```

---

# 🧠 Puzzle Engine

The puzzle engine runs entirely on the client.

## How It Works

1. Generate deterministic seed from current date
2. Select puzzle type using seeded logic
3. Generate daily puzzle locally
4. Validate answers client-side

## Puzzle Types

* Logic Grid
* Pattern Recognition
* Sequence
* Syllogism

## Deterministic Guarantee

Every player receives the same puzzle for the same day.

---

# 🔒 Authentication Flow

```text
Google OAuth
      │
      ▼
Frontend
      │
      ▼
Backend Verification
      │
      ▼
JWT Authentication
      │
      ▼
Database Persistence
```

Guest login is also supported using generated UUIDs.

---

# 🛡 Security Notes

* This project uses JWT authentication for protected routes.
* Puzzle generation and validation occur client-side.
* The application should be considered trust-based and not fully cheat-proof.
* Never commit production secrets or real environment variables to GitHub.
* Frontend environment variables prefixed with `VITE_` are publicly visible in the browser bundle.

Recommended `.gitignore` entries:

```gitignore
.env
.env.local
.env.production
node_modules
dist
```

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to GitHub
5. Open a Pull Request

---

# 📄 License

This project is currently private and not released under an open-source license.

---

<p align="center">
Built with React, Express, Prisma, and PostgreSQL
</p>
