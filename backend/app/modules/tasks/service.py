from datetime import date, datetime, timezone

from sqlalchemy import select, or_, and_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.modules.members.models import Member
from app.modules.tasks.models import Task
from app.modules.tasks.schemas import TaskCreate, TaskUpdate


async def _verify_member_exists(db: AsyncSession, member_id: int) -> None:
    result = await db.execute(select(Member).where(Member.id == member_id))
    if not result.scalar_one_or_none():
        raise NotFoundError("Member", member_id)


async def get_all_tasks(db: AsyncSession, assigned_to: int | None = None) -> list[Task]:
    query = select(Task).order_by(Task.sort_order, Task.created_at)
    if assigned_to is not None:
        query = query.where(Task.assigned_to == assigned_to)
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_tasks_by_date(db: AsyncSession, target_date: date) -> list[Task]:
    today = date.today()
    weekday = target_date.weekday()
    day_of_month = target_date.day

    start_of_day = datetime(target_date.year, target_date.month, target_date.day)
    end_of_day = datetime(target_date.year, target_date.month, target_date.day, 23, 59, 59)

    conditions = [
        and_(Task.reminder_at >= start_of_day, Task.reminder_at <= end_of_day),
        Task.recurrence == "daily",
    ]

    if weekday == target_date.weekday():
        conditions.append(
            and_(Task.recurrence == "weekly", func.strftime("%w", Task.created_at) == str(target_date.isoweekday() % 7))
        )

    conditions.append(
        and_(Task.recurrence == "monthly", func.strftime("%d", Task.created_at) == f"{day_of_month:02d}")
    )

    if target_date == today:
        conditions.append(
            and_(Task.recurrence == "none", Task.reminder_at.is_(None))
        )

    result = await db.execute(
        select(Task).where(or_(*conditions)).order_by(Task.sort_order, Task.created_at)
    )
    return list(result.scalars().all())


async def create_task(db: AsyncSession, data: TaskCreate) -> Task:
    if data.assigned_to is not None:
        await _verify_member_exists(db, data.assigned_to)

    task = Task(title=data.title, assigned_to=data.assigned_to, reminder_at=data.reminder_at, recurrence=data.recurrence.value)
    db.add(task)
    await db.flush()
    await db.refresh(task)
    return task


async def update_task(db: AsyncSession, task_id: int, data: TaskUpdate) -> Task:
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise NotFoundError("Task", task_id)

    if data.assigned_to is not None:
        await _verify_member_exists(db, data.assigned_to)

    task.title = data.title
    task.assigned_to = data.assigned_to
    task.reminder_at = data.reminder_at
    task.recurrence = data.recurrence.value
    await db.flush()
    await db.refresh(task)
    return task


async def toggle_task(db: AsyncSession, task_id: int) -> Task:
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise NotFoundError("Task", task_id)

    task.is_completed = not task.is_completed
    task.completed_at = datetime.now(timezone.utc) if task.is_completed else None
    await db.flush()
    await db.refresh(task)
    return task


async def reorder_tasks(db: AsyncSession, ids: list[int]) -> None:
    for index, task_id in enumerate(ids):
        result = await db.execute(select(Task).where(Task.id == task_id))
        task = result.scalar_one_or_none()
        if task:
            task.sort_order = index
    await db.flush()


async def delete_task(db: AsyncSession, task_id: int) -> None:
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise NotFoundError("Task", task_id)
    await db.delete(task)
