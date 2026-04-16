from pydantic import BaseModel
from typing import Optional

class InstructorCreate(BaseModel):
    instructor_name: str
    email: str
    qualification: Optional[str] = None
    experience: Optional[int] = None

class InstructorResponse(BaseModel):
    instructor_id: int
    instructor_name: str
    email: str
    qualification: Optional[str] = None
    experience: Optional[int] = None
    model_config = {"from_attributes": True}
