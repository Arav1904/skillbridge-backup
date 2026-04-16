from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate

def create_course(db: Session, data: CourseCreate) -> Course:
    c = Course(course_title=data.course_title, description=data.description,
               duration=data.duration, level=data.level or "Beginner",
               category_id=data.category_id, instructor_id=data.instructor_id)
    db.add(c); db.commit(); db.refresh(c); return c

def get_course(db: Session, course_id: int) -> Course:
    c = db.query(Course).filter(Course.course_id == course_id).first()
    if not c: raise HTTPException(status_code=404, detail="Course not found")
    return c

def get_all_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Course).offset(skip).limit(limit).all()

def update_course(db: Session, course_id: int, data: CourseUpdate) -> Course:
    c = get_course(db, course_id)
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    db.commit(); db.refresh(c); return c

def delete_course(db: Session, course_id: int) -> dict:
    c = get_course(db, course_id); db.delete(c); db.commit()
    return {"detail": f"Course {course_id} deleted"}
