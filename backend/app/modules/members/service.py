from pathlib import Path

from PIL import Image
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ValidationError
from app.modules.members.models import Member
from app.modules.members.schemas import MemberCreate, MemberUpdate
from app.modules.notes.models import Note
from app.modules.tasks.models import Task

AVATAR_DIR = Path("data/avatars")
AVATAR_MAX_SIZE = 256


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


async def update_member(db: AsyncSession, member_id: int, data: MemberUpdate) -> Member:
    result = await db.execute(select(Member).where(Member.id == member_id))
    member = result.scalar_one_or_none()
    if not member:
        raise NotFoundError("Member", member_id)

    if data.name != member.name:
        existing = await db.execute(select(Member).where(Member.name == data.name))
        if existing.scalar_one_or_none():
            raise ValidationError("Member with this name already exists")

    member.name = data.name
    member.colour = data.colour
    await db.flush()
    await db.refresh(member)
    return member


async def delete_member(db: AsyncSession, member_id: int) -> None:
    result = await db.execute(select(Member).where(Member.id == member_id))
    member = result.scalar_one_or_none()
    if not member:
        raise NotFoundError("Member", member_id)

    await db.execute(update(Task).where(Task.assigned_to == member_id).values(assigned_to=None))
    await db.execute(update(Note).where(Note.author_id == member_id).values(author_id=None))

    delete_avatar(member_id)
    await db.delete(member)


def get_avatar_path(member_id: int) -> Path:
    return AVATAR_DIR / f"{member_id}.jpg"


def avatar_exists(member_id: int) -> bool:
    return get_avatar_path(member_id).is_file()


def get_avatar_url(member_id: int) -> str | None:
    if avatar_exists(member_id):
        return f"/api/v1/members/{member_id}/avatar"
    return None


async def save_avatar(member_id: int, file_data: bytes) -> str:
    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    path = get_avatar_path(member_id)

    img = Image.open(__import__("io").BytesIO(file_data))
    img = img.convert("RGB")

    width, height = img.size
    side = min(width, height)
    left = (width - side) // 2
    top = (height - side) // 2
    img = img.crop((left, top, left + side, top + side))

    if side > AVATAR_MAX_SIZE:
        img = img.resize((AVATAR_MAX_SIZE, AVATAR_MAX_SIZE), Image.LANCZOS)

    img.save(path, "JPEG", quality=85)
    return f"/api/v1/members/{member_id}/avatar"


def delete_avatar(member_id: int) -> None:
    path = get_avatar_path(member_id)
    if path.is_file():
        path.unlink()
