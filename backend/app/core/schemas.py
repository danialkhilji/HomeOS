from pydantic import BaseModel, Field


class ReorderRequest(BaseModel):
    ids: list[int] = Field(min_length=1)
