from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class Recurrence(str, Enum):
    none = "none"
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


class MemberSummary(BaseModel):
    id: int
    name: str
    colour: str

    model_config = {"from_attributes": True}


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    assigned_to: int | None = None
    reminder_at: datetime | None = None
    recurrence: Recurrence = Recurrence.none


class TaskUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    assigned_to: int | None = None
    reminder_at: datetime | None = None
    recurrence: Recurrence = Recurrence.none


class ReorderRequest(BaseModel):
    ids: list[int] = Field(min_length=1)


class TaskResponse(BaseModel):
    id: int
    title: str
    assigned_to: int | None
    is_completed: bool
    completed_at: datetime | None
    reminder_at: datetime | None
    recurrence: str
    created_at: datetime
    member: MemberSummary | None = None

    model_config = {"from_attributes": True}
