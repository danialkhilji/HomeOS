from datetime import UTC, datetime

from sqlalchemy import case, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.modules.shopping.models import ShoppingItem
from app.modules.shopping.schemas import ShoppingItemCreate, ShoppingItemUpdate
from app.modules.shopping.store_models import Store


async def _verify_store_exists(db: AsyncSession, store_id: int) -> None:
    result = await db.execute(select(Store).where(Store.id == store_id))
    if not result.scalar_one_or_none():
        raise NotFoundError("Store", store_id)


async def get_all_items(db: AsyncSession) -> list[ShoppingItem]:
    result = await db.execute(
        select(ShoppingItem).order_by(
            case((ShoppingItem.is_purchased == False, 0), else_=1),
            ShoppingItem.sort_order,
            ShoppingItem.created_at,
        )
    )
    return list(result.scalars().all())


async def create_item(db: AsyncSession, data: ShoppingItemCreate) -> ShoppingItem:
    if data.store_id is not None:
        await _verify_store_exists(db, data.store_id)

    item = ShoppingItem(name=data.name, store_id=data.store_id)
    db.add(item)
    await db.flush()
    await db.refresh(item)
    return item


async def update_item(db: AsyncSession, item_id: int, data: ShoppingItemUpdate) -> ShoppingItem:
    result = await db.execute(select(ShoppingItem).where(ShoppingItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise NotFoundError("Shopping item", item_id)

    if data.store_id is not None:
        await _verify_store_exists(db, data.store_id)

    item.name = data.name
    item.store_id = data.store_id
    await db.flush()
    await db.refresh(item)
    return item


async def toggle_item(db: AsyncSession, item_id: int) -> ShoppingItem:
    result = await db.execute(select(ShoppingItem).where(ShoppingItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise NotFoundError("Shopping item", item_id)

    item.is_purchased = not item.is_purchased
    item.purchased_at = datetime.now(UTC) if item.is_purchased else None
    await db.flush()
    await db.refresh(item)
    return item


async def reorder_items(db: AsyncSession, ids: list[int]) -> None:
    for index, item_id in enumerate(ids):
        result = await db.execute(select(ShoppingItem).where(ShoppingItem.id == item_id))
        item = result.scalar_one_or_none()
        if item:
            item.sort_order = index
    await db.flush()


async def delete_item(db: AsyncSession, item_id: int) -> None:
    result = await db.execute(select(ShoppingItem).where(ShoppingItem.id == item_id))
    item = result.scalar_one_or_none()
    if not item:
        raise NotFoundError("Shopping item", item_id)
    await db.delete(item)
