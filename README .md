# 📋 Task Management System

> A full-stack, real-time Task Management System — built with React, Node.js, Express, PostgreSQL, Prisma, and Socket.IO.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Click_Here-2563eb?style=for-the-badge)](https://your-live-demo-url.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/eager-31/task-management-app)

---

## 📸 Screenshots

### 🖥️ Dashboard
![Dashboard](./screenshots/dashboard.png)

### 🔐 Login Page
![Login](./screenshots/login.png)

### ✅ Tasks Page
![Tasks](./screenshots/task.png)

### 👥 Users Management
![Users](./screenshots/user.png)

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT-based Authentication
- Role-Based Access Control (Admin / User)
- Protected Routes

### ✅ Task Management
- Create, Update, Delete Tasks
- View Task Details
- Assign Tasks to Users
- Upload & Download PDF Documents

### ⚡ Advanced Features
- Real-Time Updates via Socket.IO
- Search, Filter, Sort & Pagination
- Toast Notifications & Loading States
- Responsive UI

### 👥 User Management _(Admin Only)_
- Create, Update, Delete Users
- User Pagination

### 🛠️ Backend
- Prisma ORM + PostgreSQL
- Request Validation & Error Handling Middleware
- Automated Testing with Jest & Supertest

### 🐳 DevOps
- Docker & Docker Compose Support

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, React Router DOM, Tailwind CSS, Axios, React Hot Toast, Socket.IO Client |
| **Backend** | Node.js, Express.js, Prisma ORM, PostgreSQL, JWT, Multer, Socket.IO |
| **Testing** | Jest, Supertest |
| **DevOps** | Docker, Docker Compose |

---

## 📁 Project Structure

```
task-management-app/
│
├── frontend/          # React application
├── backend/           # Node.js + Express API
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/eager-31/task-management-app.git
cd task-management-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management_db?schema=public"
JWT_SECRET=task_management_secret_key
```

Run Prisma migration:

```bash
npx prisma migrate dev
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🐳 Docker Setup

Run the entire project with a single command:

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint |
|---|---|
| `POST` | `/api/auth/register` |
| `POST` | `/api/auth/login` |

### Tasks
| Method | Endpoint |
|---|---|
| `GET` | `/api/tasks` |
| `POST` | `/api/tasks` |
| `GET` | `/api/tasks/:id` |
| `PUT` | `/api/tasks/:id` |
| `DELETE` | `/api/tasks/:id` |

### Users _(Admin Only)_
| Method | Endpoint |
|---|---|
| `GET` | `/api/users` |
| `POST` | `/api/users` |
| `PUT` | `/api/users/:id` |
| `DELETE` | `/api/users/:id` |

---

## 🔄 Real-Time Features (Socket.IO)

- 🟢 Real-time task creation
- 🟡 Real-time task updates
- 🔴 Real-time task deletion

---

## 🔮 Future Improvements

- [ ] Email Notifications
- [ ] Task Comments
- [ ] Activity Logs
- [ ] Dark Mode
- [ ] Cloud Deployment

---

## 👤 Author

**Deepak Birajee**

[![GitHub](https://img.shields.io/badge/GitHub-deepakbirajee-181717?style=flat&logo=github)](https://github.com/eager-31)

---

> _Built with ❤️ using the PERN stack + Socket.IO_
