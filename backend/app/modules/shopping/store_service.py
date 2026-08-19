from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ValidationError
from app.modules.shopping.models import ShoppingItem
from app.modules.shopping.schemas import StoreCreate, StoreUpdate
from app.modules.shopping.store_models import Store


async def get_all_stores(db: AsyncSession) -> list[Store]:
    result = await db.execute(select(Store).order_by(Store.name))
    return list(result.scalars().all())


async def create_store(db: AsyncSession, data: StoreCreate) -> Store:
    existing = await db.execute(select(Store).where(Store.name == data.name))
    if existing.scalar_one_or_none():
        raise ValidationError("Store with this name already exists")

    store = Store(name=data.name, colour=data.colour)
    db.add(store)
    await db.flush()
    await db.refresh(store)
    return store


async def update_store(db: AsyncSession, store_id: int, data: StoreUpdate) -> Store:
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    if not store:
        raise NotFoundError("Store", store_id)

    if data.name != store.name:
        existing = await db.execute(select(Store).where(Store.name == data.name))
        if existing.scalar_one_or_none():
            raise ValidationError("Store with this name already exists")

    store.name = data.name
    store.colour = data.colour
    await db.flush()
    await db.refresh(store)
    return store


async def delete_store(db: AsyncSession, store_id: int) -> None:
    result = await db.execute(select(Store).where(Store.id == store_id))
    store = result.scalar_one_or_none()
    if not store:
        raise NotFoundError("Store", store_id)

    await db.execute(update(ShoppingItem).where(ShoppingItem.store_id == store_id).values(store_id=None))
    await db.delete(store)
