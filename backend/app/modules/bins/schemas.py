from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field

BinIcon = Literal["general", "garden", "food", "cardboard", "plastic", "glass"]
BinSchedule = Literal["weekly", "week_a", "week_b"]


class BinCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    colour: str = Field(min_length=7, max_length=7, pattern=r"^#[0-9a-fA-F]{6}$")
    icon: BinIcon
    schedule: BinSchedule

    model_config = {"str_strip_whitespace": True}


BinUpdate = BinCreate


class BinResponse(BaseModel):
    id: int
    name: str
    colour: str
    icon: str
    schedule: str
    created_at: datetime

    model_config = {"from_attributes": True}


class BinSummary(BaseModel):
    id: int
    name: str
    colour: str
    icon: str
    schedule: str

    model_config = {"from_attributes": True}


class BinSettingsSchema(BaseModel):
    collection_weekday: int = Field(ge=0, le=6)
    week_a_date: date

    model_config = {"from_attributes": True}


class BinCollectionResponse(BaseModel):
    date: date
    days_until: int
    week_label: Literal["A", "B"]
    bins: list[BinSummary]


class BinScheduleResponse(BaseModel):
    alternating: bool
    collections: list[BinCollectionResponse]
