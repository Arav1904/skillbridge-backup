from pydantic import BaseModel
from typing import Optional

class RoleResponse(BaseModel):
    role_id: int
    role_name: str
    description: Optional[str] = None
    model_config = {"from_attributes": True}
