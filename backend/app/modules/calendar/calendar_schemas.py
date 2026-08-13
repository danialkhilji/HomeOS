from pydantic import BaseModel

from app.modules.tasks.schemas import TaskResponse
from app.modules.calendar.birthday_schemas import BirthdayResponse


class CalendarDateResponse(BaseModel):
    date: str
    tasks: list[TaskResponse]
    birthdays: list[BirthdayResponse]
