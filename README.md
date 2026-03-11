# HRMS Lite

A lightweight Human Resource Management System (HRMS) designed to manage employee records and track daily attendance. Built as a full-stack web application.

## Tech Stack
- **Frontend**: React (Vite) with Vanilla CSS (Modern UI Design) and React Router
- **Backend**: Python (FastAPI)
- **Database**: SQLite (SQLAlchemy ORM)

## Features
- **Employee Management**: Add new employees, view list, and delete employees. Includes built-in email validation and duplicate ID checking.
- **Attendance Management**: Mark daily attendance (Present/Absent) and view employee history.
- **Seamless UI**: Professional, clean, and intuitive user interface with Loading and Error states gracefully handled.

## Running Locally

### 1. Start the Backend API
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*The backend API will run at http://localhost:8000*

### 2. Start the Frontend Application
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The React app will be accessible at http://localhost:5173*

## Assumptions & Limitations
- User authentication is intentionally omitted to meet the single-admin constraint.
- The project leverages an SQLite file-based database (`hrms.db`) for rapid deployment and setup, which is perfectly suited for low-to-moderate transactional requirements within a 6-8 hour scope limitation.
- Pydantic models validate emails and handle standard JSON type checking gracefully.
- The system prevents duplicate attendance markings on the exact same date for a single employee.

## Deployment Notes
Since the problem statement requires sharing deployed URLs to Render and Vercel, simply push this repository to GitHub, link the `backend` folder as a standard Python Web Service on Render (set start command to `uvicorn main:app --host 0.0.0.0 --port 10000`), and link the `frontend` folder to Vercel as a Vite application! 
