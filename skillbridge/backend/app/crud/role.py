from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.role import Role

def get_all_roles(db): return db.query(Role).all()

def get_role(db, role_id):
    r = db.query(Role).filter(Role.role_id==role_id).first()
    if not r: raise HTTPException(status_code=404, detail="Role not found")
    return r

def create_role(db, data):
    r = Role(**data); db.add(r); db.commit(); db.refresh(r); return r
