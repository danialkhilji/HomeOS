from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.modules.members.models import Member


async def verify_member_exists(db: AsyncSession, member_id: int) -> None:
    result = await db.execute(select(Member).where(Member.id == member_id))
    if not result.scalar_one_or_none():
        raise NotFoundError("Member", member_id)


async def reorder_items(db: AsyncSession, model_class: type, item_ids: list[int]) -> None:
    for index, item_id in enumerate(item_ids):
        result = await db.execute(select(model_class).where(model_class.id == item_id))
        item = result.scalar_one_or_none()
        if item:
            item.sort_order = index
    await db.flush()
