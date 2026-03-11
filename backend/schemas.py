from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional
from models import AttendanceStatus

class EmployeeBase(BaseModel):
    emp_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True
