from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.crud.course import get_all_courses
from app.schemas.course import CourseResponse

router = APIRouter()


@router.get("/", response_model=List[CourseResponse])
def list_courses(db: Session = Depends(get_db)):
    return get_all_courses(db)
