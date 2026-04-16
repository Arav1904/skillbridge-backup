from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.enrollment import Enrollment

def create_enrollment(db, user_id, course_id):
    if db.query(Enrollment).filter(Enrollment.user_id==user_id, Enrollment.course_id==course_id).first():
        raise HTTPException(status_code=400, detail="Already enrolled")
    e = Enrollment(user_id=user_id, course_id=course_id, progress=0)
    db.add(e); db.commit(); db.refresh(e); return e

def get_user_enrollments(db, user_id):
    return db.query(Enrollment).filter(Enrollment.user_id==user_id).all()

def get_all_enrollments(db):
    return db.query(Enrollment).all()

def update_progress(db, user_id, course_id, progress):
    e = db.query(Enrollment).filter(Enrollment.user_id==user_id, Enrollment.course_id==course_id).first()
    if not e: raise HTTPException(status_code=404, detail="Enrollment not found")
    e.progress = progress; db.commit(); db.refresh(e); return e

def delete_enrollment(db, user_id, course_id):
    e = db.query(Enrollment).filter(Enrollment.user_id==user_id, Enrollment.course_id==course_id).first()
    if not e: raise HTTPException(status_code=404, detail="Enrollment not found")
    db.delete(e); db.commit(); return {"detail": "Unenrolled"}
