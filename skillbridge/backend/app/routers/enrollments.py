from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud.enrollment import create_enrollment, get_user_enrollments, get_all_enrollments, update_progress, delete_enrollment
from app.schemas.enrollment import EnrollmentCreate, EnrollmentUpdate, EnrollmentResponse
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[EnrollmentResponse])
def list_all(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return get_all_enrollments(db)

@router.get("/me", response_model=List[EnrollmentResponse])
def my_enrollments(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_user_enrollments(db, current_user.user_id)

@router.post("/", response_model=EnrollmentResponse, status_code=201)
def enroll(data: EnrollmentCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return create_enrollment(db, data.user_id, data.course_id)

@router.put("/{user_id}/{course_id}", response_model=EnrollmentResponse)
def update(user_id: int, course_id: int, data: EnrollmentUpdate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return update_progress(db, user_id, course_id, data.progress or 0)

@router.delete("/{user_id}/{course_id}")
def unenroll(user_id: int, course_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return delete_enrollment(db, user_id, course_id)
