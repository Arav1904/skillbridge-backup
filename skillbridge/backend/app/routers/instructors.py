from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud.instructor import get_all_instructors, create_instructor
from app.schemas.instructor import InstructorCreate, InstructorResponse

router = APIRouter()

@router.get("/", response_model=List[InstructorResponse])
def list_instructors(db: Session = Depends(get_db)):
    return get_all_instructors(db)

@router.post("/", response_model=InstructorResponse, status_code=201)
def add_instructor(data: InstructorCreate, db: Session = Depends(get_db)):
    return create_instructor(db, data.model_dump())
