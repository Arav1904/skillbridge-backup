from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.instructor import Instructor

def get_all_instructors(db): return db.query(Instructor).all()

def get_instructor(db, instructor_id):
    i = db.query(Instructor).filter(Instructor.instructor_id==instructor_id).first()
    if not i: raise HTTPException(status_code=404, detail="Instructor not found")
    return i

def create_instructor(db, data):
    i = Instructor(**data); db.add(i); db.commit(); db.refresh(i); return i
