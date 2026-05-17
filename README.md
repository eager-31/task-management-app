# 📋 Task Management System

> A full-stack, real-time Task Management System built with React, Node.js, Express, PostgreSQL, Prisma, and Socket.IO.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Click_Here-2563eb?style=for-the-badge)](https://task-management-app-git-master-deepak-birajees-projects.vercel.app)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/eager-31/task-management-app)

---

# 🌐 Live Deployment

## Frontend
https://task-management-app-git-master-deepak-birajees-projects.vercel.app

## Backend API
https://task-management-backend-78xa.onrender.com

## Swagger API Docs
https://task-management-backend-78xa.onrender.com/api-docs

---

# 📸 Screenshots

## 🖥️ Dashboard
![Dashboard](./screenshots/dashboard.png)

## 🔐 Login Page
![Login](./screenshots/login.png)

## ✅ Tasks Page
![Tasks](./screenshots/tasks.png)

## 👥 Users Management
![Users](./screenshots/users.png)

---

# 🚀 Features

## 🔐 Authentication & Authorization
- User Registration & Login
- JWT-based Authentication
- Role-Based Access Control (Admin/User)
- Protected Routes

## ✅ Task Management
- Create Tasks
- Update Tasks
- Delete Tasks
- View Task Details
- Assign Tasks to Users
- Upload & Download PDF Documents

## ⚡ Advanced Features
- Real-Time Updates using Socket.IO
- Search Tasks
- Filter Tasks
- Sort Tasks
- Pagination
- Responsive UI
- Toast Notifications
- Loading States

## 👥 User Management (Admin Only)
- Create User
- Update User
- Delete User
- User Pagination

## 🛠️ Backend Features
- Prisma ORM
- PostgreSQL Database
- REST API Architecture
- API Validation Middleware
- Error Handling Middleware
- Automated Testing using Jest & Supertest

## 🐳 DevOps
- Docker Support
- Docker Compose Setup
- Cloud Deployment (Render + Vercel + Neon)

---

# 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, React Router DOM, Tailwind CSS, Axios, React Hot Toast, Socket.IO Client |
| Backend | Node.js, Express.js, Prisma ORM, PostgreSQL, JWT, Multer, Socket.IO |
| Testing | Jest, Supertest |
| DevOps | Docker, Docker Compose, Render, Vercel, Neon PostgreSQL |

---

# 📁 Project Structure

```bash
task-management-app/
│
├── frontend/              # React frontend application
├── backend/               # Node.js + Express backend API
├── screenshots/           # Project screenshots
├── docker-compose.yml
└── README.md
```

---

# 🏗️ Architecture & Design Decisions

## Frontend
- Built using React with component-based architecture.
- Axios used for API communication.
- Socket.IO Client used for real-time updates.
- Tailwind CSS used for responsive UI design.

## Backend
- RESTful API architecture using Express.js.
- Prisma ORM used for database operations.
- JWT authentication implemented for secure access.
- Middleware-based validation and authorization.
- Socket.IO implemented for real-time task updates.

## Database
- PostgreSQL used as the relational database.
- Prisma schema used for database modeling and migrations.

## Deployment
- Frontend deployed on Vercel.
- Backend deployed on Render.
- PostgreSQL hosted on Neon.

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/eager-31/task-management-app.git

cd task-management-app
```

---

# 🔧 Backend Setup

```bash
cd backend

npm install
```

Create `.env` file inside `/backend`:

```env
PORT=5000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management_db?schema=public"

JWT_SECRET=task_management_secret_key
```

Run Prisma migration:

```bash
npx prisma migrate dev
```

Start backend server:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🎨 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🐳 Docker Setup

Run the complete project using Docker:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

---

# 🧪 Running Tests

```bash
cd backend

npm test
```

Run test coverage:

```bash
npm test -- --coverage
```

## ✅ Test Coverage

- Statements: 80%+
- Branches: 70%+
- Lines: 80%+

---

# 📘 Swagger API Documentation

Swagger UI available at:

```bash
http://localhost:5000/api-docs
```

Live Swagger Docs:

```bash
https://task-management-backend-78xa.onrender.com/api-docs
```

---

# 📡 API Endpoints

## 🔐 Authentication

| Method | Endpoint |
|---|---|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |

---

## ✅ Tasks

| Method | Endpoint |
|---|---|
| GET | `/api/tasks` |
| POST | `/api/tasks` |
| GET | `/api/tasks/:id` |
| PUT | `/api/tasks/:id` |
| DELETE | `/api/tasks/:id` |

---

## 👥 Users (Admin Only)

| Method | Endpoint |
|---|---|
| GET | `/api/users` |
| POST | `/api/users` |
| PUT | `/api/users/:id` |
| DELETE | `/api/users/:id` |

---

# 🔄 Real-Time Features (Socket.IO)

- 🟢 Real-time task creation
- 🟡 Real-time task updates
- 🔴 Real-time task deletion

---

# 🚀 Deployment Platforms

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

---

# 🔮 Future Improvements

- [ ] Email Notifications
- [ ] Task Comments
- [ ] Activity Logs
- [ ] Dark Mode
- [ ] Team Collaboration
- [ ] Push Notifications

---

# 👤 Author

## Deepak Birajee

[![GitHub](https://img.shields.io/badge/GitHub-eager--31-181717?style=flat&logo=github)](https://github.com/eager-31)

---

> > Built with ❤️ using React, Node.js, Express, PostgreSQL, Prisma, and Socket.IO.