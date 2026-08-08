from datetime import datetime

from pydantic import BaseModel, Field

from app.modules.tasks.schemas import MemberSummary


class NoteCreate(BaseModel):
    content: str = Field(min_length=1, max_length=500)
    author_id: int | None = None


class NoteUpdate(BaseModel):
    content: str = Field(min_length=1, max_length=500)


class NoteResponse(BaseModel):
    id: int
    content: str
    author_id: int | None
    created_at: datetime
    author: MemberSummary | None = None

    model_config = {"from_attributes": True}
