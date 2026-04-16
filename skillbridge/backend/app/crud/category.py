from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.category import Category

def get_all_categories(db): return db.query(Category).all()

def get_category(db, category_id):
    c = db.query(Category).filter(Category.category_id==category_id).first()
    if not c: raise HTTPException(status_code=404, detail="Category not found")
    return c

def create_category(db, data):
    c = Category(**data); db.add(c); db.commit(); db.refresh(c); return c
