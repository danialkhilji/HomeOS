from datetime import datetime, timezone

from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.modules.tasks.models import Task

logger = get_logger(__name__)


async def reset_recurring_tasks(db: AsyncSession) -> None:
    now = datetime.now(timezone.utc)
    weekday = now.weekday()
    day_of_month = now.day

    daily_result = await db.execute(
        select(Task).where(
            and_(Task.recurrence == "daily", Task.is_completed == True)  # noqa: E712
        )
    )
    daily_tasks = list(daily_result.scalars().all())

    weekly_tasks = []
    if weekday == 0:
        weekly_result = await db.execute(
            select(Task).where(
                and_(Task.recurrence == "weekly", Task.is_completed == True)  # noqa: E712
            )
        )
        weekly_tasks = list(weekly_result.scalars().all())

    monthly_tasks = []
    if day_of_month == 1:
        monthly_result = await db.execute(
            select(Task).where(
                and_(Task.recurrence == "monthly", Task.is_completed == True)  # noqa: E712
            )
        )
        monthly_tasks = list(monthly_result.scalars().all())

    all_tasks = daily_tasks + weekly_tasks + monthly_tasks

    for task in all_tasks:
        task.is_completed = False
        task.completed_at = None

    await db.flush()

    if all_tasks:
        logger.info(
            "Recurring task reset: %d daily, %d weekly, %d monthly",
            len(daily_tasks), len(weekly_tasks), len(monthly_tasks),
        )
    else:
        logger.info("Recurring task reset: no tasks to reset")
