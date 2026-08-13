from datetime import datetime

from pydantic import BaseModel, Field


class BirthdayCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    month: int = Field(ge=1, le=12)
    day: int = Field(ge=1, le=31)


class BirthdayResponse(BaseModel):
    id: int
    name: str
    month: int
    day: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UpcomingBirthdayResponse(BaseModel):
    id: int
    name: str
    month: int
    day: int
    days_until: int

    model_config = {"from_attributes": True}
