from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud.lesson import create_lesson, get_all_lessons, get_lesson, update_lesson, delete_lesson
from app.schemas.lesson import LessonCreate, LessonUpdate, LessonResponse
from app.utils.dependencies import get_current_user, require_instructor

router = APIRouter()

@router.get("/", response_model=List[LessonResponse])
def list_lessons(skip: int=0, limit: int=100, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return get_all_lessons(db, skip, limit)

@router.get("/{lesson_id}", response_model=LessonResponse)
def get_one(lesson_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return get_lesson(db, lesson_id)

@router.post("/", response_model=LessonResponse, status_code=201)
def create(data: LessonCreate, db: Session = Depends(get_db), _=Depends(require_instructor)):
    return create_lesson(db, data.model_dump())

@router.put("/{lesson_id}", response_model=LessonResponse)
def update(lesson_id: int, data: LessonUpdate, db: Session = Depends(get_db), _=Depends(require_instructor)):
    return update_lesson(db, lesson_id, data.model_dump(exclude_unset=True))

@router.delete("/{lesson_id}")
def delete(lesson_id: int, db: Session = Depends(get_db), _=Depends(require_instructor)):
    return delete_lesson(db, lesson_id)
