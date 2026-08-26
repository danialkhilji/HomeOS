from pydantic import BaseModel

from app.modules.calendar.birthday_schemas import BirthdayResponse
from app.modules.tasks.schemas import TaskResponse


class CalendarDateResponse(BaseModel):
    date: str
    tasks: list[TaskResponse]
    birthdays: list[BirthdayResponse]
