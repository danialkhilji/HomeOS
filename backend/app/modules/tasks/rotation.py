from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.modules.members.models import Member
from app.modules.tasks.models import Task

logger = get_logger(__name__)


async def rotate_tasks(db: AsyncSession) -> None:
    members_result = await db.execute(select(Member).order_by(Member.id))
    members = list(members_result.scalars().all())

    if not members:
        logger.info("Rotation skipped: no members")
        return

    tasks_result = await db.execute(
        select(Task).where(Task.assigned_to.isnot(None)).order_by(Task.id)
    )
    tasks = list(tasks_result.scalars().all())

    if not tasks:
        logger.info("Rotation skipped: no tasks")
        return

    member_ids = [m.id for m in members]

    for task in tasks:
        if task.assigned_to is None:
            task.assigned_to = member_ids[0]
        else:
            try:
                current_index = member_ids.index(task.assigned_to)
                next_index = (current_index + 1) % len(member_ids)
                task.assigned_to = member_ids[next_index]
            except ValueError:
                task.assigned_to = member_ids[0]

        task.is_completed = False
        task.completed_at = None

    await db.flush()
    logger.info("Rotation complete: %d tasks rotated across %d members", len(tasks), len(members))
