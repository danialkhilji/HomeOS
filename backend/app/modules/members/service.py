from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ValidationError
from app.modules.members.models import Member
from app.modules.members.schemas import MemberCreate


async def get_all_members(db: AsyncSession) -> list[Member]:
    result = await db.execute(select(Member).order_by(Member.name))
    return list(result.scalars().all())


async def create_member(db: AsyncSession, data: MemberCreate) -> Member:
    existing = await db.execute(select(Member).where(Member.name == data.name))
    if existing.scalar_one_or_none():
        raise ValidationError("Member with this name already exists")

    member = Member(name=data.name, colour=data.colour)
    db.add(member)
    await db.flush()
    await db.refresh(member)
    return member


async def delete_member(db: AsyncSession, member_id: int) -> None:
    result = await db.execute(select(Member).where(Member.id == member_id))
    member = result.scalar_one_or_none()
    if not member:
        raise NotFoundError("Member", member_id)
    await db.delete(member)
