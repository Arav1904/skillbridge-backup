from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.auth import hash_password

def create_user(db: Session, data: UserCreate) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    u = User(name=data.name, email=data.email, password=hash_password(data.password), role_id=data.role_id)
    db.add(u); db.commit(); db.refresh(u); return u

def get_user(db: Session, user_id: int) -> User:
    u = db.query(User).filter(User.user_id == user_id).first()
    if not u: raise HTTPException(status_code=404, detail="User not found")
    return u

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_all_users(db: Session):
    return db.query(User).all()

def update_user(db: Session, user_id: int, data) -> User:
    u = get_user(db, user_id)
    for k, v in data.model_dump(exclude_unset=True).items():
        if v is not None: setattr(u, k, v)
    db.commit(); db.refresh(u); return u

def delete_user(db: Session, user_id: int):
    u = get_user(db, user_id); db.delete(u); db.commit()
    return {"detail": f"User {user_id} deleted"}
