from datetime import datetime

from pydantic import BaseModel, Field


class StoreSummary(BaseModel):
    id: int
    name: str
    colour: str

    model_config = {"from_attributes": True}


class StoreCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    colour: str = Field(min_length=7, max_length=7, pattern=r"^#[0-9a-fA-F]{6}$")


class StoreUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    colour: str = Field(min_length=7, max_length=7, pattern=r"^#[0-9a-fA-F]{6}$")


class StoreResponse(BaseModel):
    id: int
    name: str
    colour: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ShoppingItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    store_id: int | None = None


class ShoppingItemUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    store_id: int | None = None


class ShoppingItemResponse(BaseModel):
    id: int
    name: str
    is_purchased: bool
    purchased_at: datetime | None
    store_id: int | None
    created_at: datetime
    store: StoreSummary | None = None

    model_config = {"from_attributes": True}
