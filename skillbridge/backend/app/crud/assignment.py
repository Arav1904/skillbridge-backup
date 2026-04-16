from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.assignment import Assignment

def create_assignment(db, data):
    a = Assignment(**data); db.add(a); db.commit(); db.refresh(a); return a

def get_assignment(db, assignment_id):
    a = db.query(Assignment).filter(Assignment.assignment_id==assignment_id).first()
    if not a: raise HTTPException(status_code=404, detail="Assignment not found")
    return a

def get_all_assignments(db, skip=0, limit=100):
    return db.query(Assignment).offset(skip).limit(limit).all()

def update_assignment(db, assignment_id, data):
    a = get_assignment(db, assignment_id)
    for k,v in data.items():
        if v is not None: setattr(a, k, v)
    db.commit(); db.refresh(a); return a

def delete_assignment(db, assignment_id):
    a = get_assignment(db, assignment_id); db.delete(a); db.commit()
    return {"detail": f"Assignment {assignment_id} deleted"}
