from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud.category import get_all_categories, create_category, get_category
from app.schemas.category import CategoryCreate, CategoryResponse

router = APIRouter()

@router.get("/", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    return get_all_categories(db)

@router.post("/", response_model=CategoryResponse, status_code=201)
def add_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, data.model_dump())
