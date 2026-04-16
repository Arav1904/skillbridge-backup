from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.submission import Submission

def create_submission(db, assignment_id, user_id):
    if db.query(Submission).filter(Submission.assignment_id==assignment_id, Submission.user_id==user_id).first():
        raise HTTPException(status_code=400, detail="Already submitted")
    s = Submission(assignment_id=assignment_id, user_id=user_id)
    db.add(s); db.commit(); db.refresh(s); return s

def get_submission(db, assignment_id, user_id):
    s = db.query(Submission).filter(Submission.assignment_id==assignment_id, Submission.user_id==user_id).first()
    if not s: raise HTTPException(status_code=404, detail="Submission not found")
    return s

def get_all_submissions(db):
    return db.query(Submission).all()

def get_user_submissions(db, user_id):
    return db.query(Submission).filter(Submission.user_id==user_id).all()

def grade_submission(db, assignment_id, user_id, marks):
    s = get_submission(db, assignment_id, user_id)
    s.marks = marks; db.commit(); db.refresh(s); return s
