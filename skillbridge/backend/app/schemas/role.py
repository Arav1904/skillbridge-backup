from pydantic import BaseModel
from typing import Optional

class RoleCreate(BaseModel):
    role_name: str
    description: Optional[str] = None

class RoleUpdate(BaseModel):
    role_name: Optional[str] = None
    description: Optional[str] = None

class RoleResponse(BaseModel):
    role_id: int
    role_name: str
    description: Optional[str] = None
    model_config = {"from_attributes": True}
