from pydantic import BaseModel
from typing import Optional

class CategoryCreate(BaseModel):
    category_name: str
    description: Optional[str] = None

class CategoryResponse(BaseModel):
    category_id: int
    category_name: str
    description: Optional[str] = None
    model_config = {"from_attributes": True}
