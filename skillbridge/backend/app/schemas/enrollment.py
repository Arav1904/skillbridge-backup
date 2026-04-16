from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EnrollmentCreate(BaseModel):
    user_id: int
    course_id: int

class EnrollmentUpdate(BaseModel):
    progress: Optional[int] = None

class EnrollmentResponse(BaseModel):
    user_id: int
    course_id: int
    enrollment_date: Optional[datetime] = None
    progress: int = 0
    model_config = {"from_attributes": True}
