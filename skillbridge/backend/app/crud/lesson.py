from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.lesson import Lesson

def create_lesson(db, data):
    l = Lesson(**data); db.add(l); db.commit(); db.refresh(l); return l

def get_lesson(db, lesson_id):
    l = db.query(Lesson).filter(Lesson.lesson_id==lesson_id).first()
    if not l: raise HTTPException(status_code=404, detail="Lesson not found")
    return l

def get_all_lessons(db, skip=0, limit=100):
    return db.query(Lesson).offset(skip).limit(limit).all()

def update_lesson(db, lesson_id, data):
    l = get_lesson(db, lesson_id)
    for k,v in data.items():
        if v is not None: setattr(l, k, v)
    db.commit(); db.refresh(l); return l

def delete_lesson(db, lesson_id):
    l = get_lesson(db, lesson_id); db.delete(l); db.commit()
    return {"detail": f"Lesson {lesson_id} deleted"}
