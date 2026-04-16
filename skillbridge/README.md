# 🎓 SkillBridge — Online Learning Platform (DBMS Lab Project)

Full-stack web application demonstrating **complete CRUD operations** on a normalized relational database. Built with FastAPI + React + SQLite/PostgreSQL.

## 🚀 Quick Start

### Backend (Terminal 1)
```bash
cd skillbridge/backend
py -m pip install -r requirements.txt
py seed.py
py -m uvicorn app.main:app --reload
```
Open **http://localhost:8000/docs** to see all API endpoints.

### Frontend (Terminal 2)
```bash
cd skillbridge/frontend
npm install
npm run dev
```
Open **http://localhost:5173**

## 🔑 Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | test123 |
| Instructor | prof@test.com | test123 |
| Admin | admin@skillbridge.com | admin123 |

## 📊 CRUD Operations Demonstrated

| Entity | CREATE | READ | UPDATE | DELETE |
|--------|--------|------|--------|--------|
| Users | Register form | View profile `/me` | Edit profile | Admin delete |
| Courses | Instructor creates | Public browse `/courses` | Edit title/level | Instructor delete |
| Enrollments | Student enrolls | My courses dashboard | Progress % update | Unenroll |
| Assignments | Instructor posts | List all assignments | Edit details | Delete |
| Submissions | Student clicks Submit | View grade | Instructor grades | — |
| Lessons | Instructor adds | Course curriculum viewer | Edit content | Delete |
| Certificates | Issued on completion | My certificates page | — | Admin revoke |

## 🗄️ Database Schema

```
roles (role_id, role_name, description)
users (user_id, name, email, password, role_id→roles, date_joined)
categories (category_id, category_name, description)
instructors (instructor_id, name, email, qualification, experience)
courses (course_id, title, description, duration, level, category_id→categories, instructor_id→instructors)
lessons (lesson_id, course_id→courses, title, content, duration)
assignments (assignment_id, course_id→courses, title, description, due_date)
enrollment (user_id→users, course_id→courses, enrollment_date, progress)  ← composite PK
submissions (assignment_id→assignments, user_id→users, submission_date, marks)  ← composite PK
certificates (user_id→users, course_id→courses, issue_date, grade)  ← composite PK
```

## 🛠️ Tech Stack
- **Backend**: FastAPI 0.110, SQLAlchemy 2.x, Pydantic v2, JWT Auth, SQLite
- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Recharts, React Router v6, Axios

## 📁 Project Structure
```
skillbridge/
├── backend/
│   ├── app/
│   │   ├── models/     — SQLAlchemy ORM (10 tables)
│   │   ├── schemas/    — Pydantic request/response shapes
│   │   ├── crud/       — All DB operations (Create/Read/Update/Delete)
│   │   ├── routers/    — FastAPI route handlers
│   │   ├── utils/      — JWT auth + dependencies
│   │   ├── config.py   — Settings from .env
│   │   ├── database.py — Engine + session factory
│   │   └── main.py     — App entrypoint + CORS
│   ├── seed.py         — Populate DB with demo data
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── pages/      — Student, Instructor, Public pages
    │   ├── components/ — Navbar, Toast, CourseCard etc.
    │   ├── context/    — Auth state (JWT in localStorage)
    │   └── api/        — Axios with auto-token interceptor
    └── package.json
```
