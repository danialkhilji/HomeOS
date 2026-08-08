from datetime import datetime

from pydantic import BaseModel, Field


class ShoppingItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)


class ShoppingItemUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=200)


class ShoppingItemResponse(BaseModel):
    id: int
    name: str
    is_purchased: bool
    created_at: datetime

    model_config = {"from_attributes": True}
