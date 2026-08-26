from datetime import UTC, datetime, timedelta

from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.modules.notes.models import Note
from app.modules.shopping.models import ShoppingItem
from app.modules.tasks.models import Task

logger = get_logger(__name__)

RETENTION_DAYS = 365


async def cleanup_old_records(db: AsyncSession) -> None:
    cutoff = datetime.now(UTC).replace(tzinfo=None) - timedelta(days=RETENTION_DAYS)

    tasks_result = await db.execute(
        delete(Task).where(Task.is_completed == True, Task.completed_at < cutoff)
    )
    tasks_deleted = tasks_result.rowcount

    shopping_result = await db.execute(
        delete(ShoppingItem).where(ShoppingItem.is_purchased == True, ShoppingItem.purchased_at < cutoff)
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