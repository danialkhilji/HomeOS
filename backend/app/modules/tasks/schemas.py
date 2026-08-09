from datetime import datetime

from pydantic import BaseModel, Field


class MemberSummary(BaseModel):
    id: int
    name: str
    colour: str

    model_config = {"from_attributes": True}


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    assigned_to: int | None = None


class TaskUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    assigned_to: int | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    assigned_to: int | None
    is_completed: bool
    completed_at: datetime | None
    created_at: datetime
    member: MemberSummary | None = None

    model_config = {"from_attributes": True}
