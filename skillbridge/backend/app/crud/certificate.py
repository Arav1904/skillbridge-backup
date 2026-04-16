from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.certificate import Certificate

def create_certificate(db, user_id, course_id, grade=None):
    if db.query(Certificate).filter(Certificate.user_id==user_id, Certificate.course_id==course_id).first():
        raise HTTPException(status_code=400, detail="Certificate already issued")
    c = Certificate(user_id=user_id, course_id=course_id, grade=grade)
    db.add(c); db.commit(); db.refresh(c); return c

def get_user_certificates(db, user_id):
    return db.query(Certificate).filter(Certificate.user_id==user_id).all()

def get_all_certificates(db):
    return db.query(Certificate).all()

def delete_certificate(db, user_id, course_id):
    c = db.query(Certificate).filter(Certificate.user_id==user_id, Certificate.course_id==course_id).first()
    if not c: raise HTTPException(status_code=404, detail="Certificate not found")
    db.delete(c); db.commit(); return {"detail": "Certificate revoked"}
