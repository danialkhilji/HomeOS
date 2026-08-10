from datetime import datetime

from pydantic import BaseModel, Field


class MemberCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    colour: str = Field(min_length=7, max_length=7, pattern=r"^#[0-9a-fA-F]{6}$")


class MemberUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    colour: str = Field(min_length=7, max_length=7, pattern=r"^#[0-9a-fA-F]{6}$")


class MemberResponse(BaseModel):
    id: int
    name: str
    colour: str
    created_at: datetime

    model_config = {"from_attributes": True}
