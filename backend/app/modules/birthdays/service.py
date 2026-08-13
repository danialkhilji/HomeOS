from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.modules.birthdays.models import Birthday
from app.modules.birthdays.schemas import BirthdayCreate, UpcomingBirthdayResponse


async def get_all_birthdays(db: AsyncSession) -> list[Birthday]:
    result = await db.execute(select(Birthday).order_by(Birthday.month, Birthday.day))
    return list(result.scalars().all())


async def get_birthdays_by_date(db: AsyncSession, month: int, day: int) -> list[Birthday]:
    result = await db.execute(
        select(Birthday).where(Birthday.month == month, Birthday.day == day)
    )
    return list(result.scalars().all())


async def get_upcoming_birthdays(db: AsyncSession, days: int = 7) -> list[UpcomingBirthdayResponse]:
    today = date.today()
    result = await db.execute(select(Birthday))
    all_birthdays = list(result.scalars().all())

    upcoming = []
    for bday in all_birthdays:
        try:
            this_year = date(today.year, bday.month, bday.day)
        except ValueError:
            continue

        if this_year < today:
            this_year = date(today.year + 1, bday.month, bday.day)

        days_until = (this_year - today).days
        if 0 <= days_until <= days:
            upcoming.append(UpcomingBirthdayResponse(
                id=bday.id,
                name=bday.name,
                month=bday.month,
                day=bday.day,
                days_until=days_until,
            ))

    upcoming.sort(key=lambda b: b.days_until)
    return upcoming


async def create_birthday(db: AsyncSession, data: BirthdayCreate) -> Birthday:
    birthday = Birthday(name=data.name, month=data.month, day=data.day)
    db.add(birthday)
    await db.flush()
    await db.refresh(birthday)
    return birthday


async def delete_birthday(db: AsyncSession, birthday_id: int) -> None:
    result = await db.execute(select(Birthday).where(Birthday.id == birthday_id))
    birthday = result.scalar_one_or_none()
    if not birthday:
        raise NotFoundError("Birthday", birthday_id)
    await db.delete(birthday)
