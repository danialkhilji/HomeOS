from datetime import datetime, timedelta, timezone

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.modules.tasks.models import Task
from app.modules.shopping.models import ShoppingItem
from app.modules.notes.models import Note

logger = get_logger(__name__)

RETENTION_DAYS = 365


async def cleanup_old_records(db: AsyncSession) -> None:
    cutoff = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=RETENTION_DAYS)

    tasks_result = await db.execute(
        delete(Task).where(Task.is_completed == True, Task.completed_at < cutoff)  # noqa: E712
    )
    tasks_deleted = tasks_result.rowcount

    shopping_result = await db.execute(
        delete(ShoppingItem).where(ShoppingItem.is_purchased == True, ShoppingItem.created_at < cutoff)  # noqa: E712
    )
    shopping_deleted = shopping_result.rowcount

    notes_result = await db.execute(
        delete(Note).where(Note.created_at < cutoff)
    )
    notes_deleted = notes_result.rowcount

    await db.flush()

    logger.info(
        "Cleanup complete: %d tasks, %d shopping items, %d notes deleted (older than %d days)",
        tasks_deleted, shopping_deleted, notes_deleted, RETENTION_DAYS,
    )