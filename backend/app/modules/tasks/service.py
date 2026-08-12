from datetime import datetime, timezone

from sqlalchemy import select
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


async def create_task(db: AsyncSession, data: TaskCreate) -> Task:
    if data.assigned_to is not None:
        await _verify_member_exists(db, data.assigned_to)

    task = Task(title=data.title, assigned_to=data.assigned_to)
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


async def delete_task(db: AsyncSession, task_id: int) -> None:
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise NotFoundError("Task", task_id)
    await db.delete(task)
