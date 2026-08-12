from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.modules.shopping.quick_add_models import QuickAddItem
from app.modules.shopping.quick_add_schemas import QuickAddItemCreate


async def get_all_quick_add_items(db: AsyncSession) -> list[QuickAddItem]:
    result = await db.execute(select(QuickAddItem).order_by(QuickAddItem.sort_order))
    return list(result.scalars().all())


async def create_quick_add_item(db: AsyncSession, data: QuickAddItemCreate) -> QuickAddItem:
    max_order = await db.execute(select(func.coalesce(func.max(QuickAddItem.sort_order), -1)))
    next_order = (max_order.scalar() or 0) + 1

    item = QuickAddItem(name=data.name, emoji=data.emoji, sort_order=next_order)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return item


async def delete_quick_add_item(db: AsyncSession, item_id: int) -> None:
    result = await db.execute(select(QuickAddItem).where(QuickAddItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise NotFoundError("Quick add item", item_id)
    await db.delete(item)
