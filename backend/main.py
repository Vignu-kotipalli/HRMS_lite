from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "HRMS Lite API is running"}

@app.post("/api/employees", response_model=schemas.Employee, status_code=201)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    # Check if emp_id exists
    db_emp = db.query(models.Employee).filter(models.Employee.emp_id == employee.emp_id).first()
    if db_emp:
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    
    new_employee = models.Employee(**employee.model_dump())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

@app.get("/api/employees", response_model=List[schemas.Employee])
def list_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()

@app.delete("/api/employees/{id}", status_code=204)
def delete_employee(id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()

@app.post("/api/attendance/{employee_id}", response_model=schemas.Attendance, status_code=201)
def mark_attendance(employee_id: int, attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if attendance for that date already exists
    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id,
        models.Attendance.date == attendance.date
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")
        
    new_attendance = models.Attendance(**attendance.model_dump(), employee_id=employee_id)
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance

@app.get("/api/attendance/{employee_id}", response_model=List[schemas.Attendance])
def view_attendance(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(models.Employee).filter(models.Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db.query(models.Attendance).filter(models.Attendance.employee_id == employee_id).all()
