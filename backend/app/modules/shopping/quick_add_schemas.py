from pydantic import BaseModel, Field


class QuickAddItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    emoji: str = Field(min_length=1, max_length=10)


class QuickAddItemResponse(BaseModel):
    id: int
    name: str
    emoji: str
    sort_order: int

    model_config = {"from_attributes": True}
