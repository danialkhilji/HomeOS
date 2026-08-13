from datetime import date

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.tasks.service import get_tasks_by_date
from app.modules.calendar.birthday_service import get_birthdays_by_date
from app.modules.calendar.calendar_schemas import CalendarDateResponse


async def get_calendar_by_date(db: AsyncSession, target_date: date) -> CalendarDateResponse:
    tasks = await get_tasks_by_date(db, target_date)
    birthdays = await get_birthdays_by_date(db, target_date.month, target_date.day)

    return CalendarDateResponse(
        date=target_date.isoformat(),
        tasks=tasks,
        birthdays=birthdays,
    )
