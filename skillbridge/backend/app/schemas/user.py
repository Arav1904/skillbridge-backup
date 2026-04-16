from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role_id: Optional[int] = 3

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role_id: Optional[int] = None

class UserResponse(BaseModel):
    user_id: int
    name: str
    email: str
    role_id: int
    date_joined: Optional[datetime] = None
    model_config = {"from_attributes": True}
