from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud.assignment import create_assignment, get_all_assignments, get_assignment, update_assignment, delete_assignment
from app.schemas.assignment import AssignmentCreate, AssignmentUpdate, AssignmentResponse
from app.utils.dependencies import get_current_user, require_instructor

router = APIRouter()

@router.get("/", response_model=List[AssignmentResponse])
def list_all(skip: int=0, limit: int=100, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return get_all_assignments(db, skip, limit)

@router.get("/{assignment_id}", response_model=AssignmentResponse)
def get_one(assignment_id: int, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return get_assignment(db, assignment_id)

@router.post("/", response_model=AssignmentResponse, status_code=201)
def create(data: AssignmentCreate, db: Session = Depends(get_db), _=Depends(require_instructor)):
    return create_assignment(db, data.model_dump())

@router.put("/{assignment_id}", response_model=AssignmentResponse)
def update(assignment_id: int, data: AssignmentUpdate, db: Session = Depends(get_db), _=Depends(require_instructor)):
    return update_assignment(db, assignment_id, data.model_dump(exclude_unset=True))

@router.delete("/{assignment_id}")
def delete(assignment_id: int, db: Session = Depends(get_db), _=Depends(require_instructor)):
    return delete_assignment(db, assignment_id)
