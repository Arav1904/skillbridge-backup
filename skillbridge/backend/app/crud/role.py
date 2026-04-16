from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.role import Role

def get_all_roles(db: Session):
    return db.query(Role).all()

def get_role(db: Session, role_id: int):
    r = db.query(Role).filter(Role.role_id == role_id).first()
    if not r: raise HTTPException(status_code=404, detail="Role not found")
    return r

def create_role(db: Session, data):
    r = Role(**data.model_dump()); db.add(r); db.commit(); db.refresh(r); return r

def update_role(db: Session, role_id: int, data):
    r = get_role(db, role_id)
    for k, v in data.model_dump(exclude_unset=True).items():
        if v is not None: setattr(r, k, v)
    db.commit(); db.refresh(r); return r

def delete_role(db: Session, role_id: int):
    r = get_role(db, role_id); db.delete(r); db.commit()
    return {"detail": f"Role {role_id} deleted"}
