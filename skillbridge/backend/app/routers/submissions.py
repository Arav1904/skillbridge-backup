from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud.submission import create_submission, get_all_submissions, get_user_submissions, grade_submission
from app.schemas.submission import SubmissionCreate, SubmissionGrade, SubmissionResponse
from app.utils.dependencies import get_current_user, require_instructor

router = APIRouter()

@router.get("/", response_model=List[SubmissionResponse])
def list_all(db: Session = Depends(get_db), _=Depends(require_instructor)):
    return get_all_submissions(db)

@router.get("/me", response_model=List[SubmissionResponse])
def my_subs(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_user_submissions(db, current_user.user_id)

@router.post("/", response_model=SubmissionResponse, status_code=201)
def submit(data: SubmissionCreate, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return create_submission(db, data.assignment_id, data.user_id)

@router.put("/{assignment_id}/{user_id}", response_model=SubmissionResponse)
def grade(assignment_id: int, user_id: int, data: SubmissionGrade, db: Session = Depends(get_db), _=Depends(require_instructor)):
    return grade_submission(db, assignment_id, user_id, data.marks)
