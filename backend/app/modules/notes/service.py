from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.modules.members.models import Member
from app.modules.notes.models import Note
from app.modules.notes.schemas import NoteCreate, NoteUpdate


async def _verify_member_exists(db: AsyncSession, member_id: int) -> None:
    result = await db.execute(select(Member).where(Member.id == member_id))
    if not result.scalar_one_or_none():
        raise NotFoundError("Member", member_id)


async def get_all_notes(db: AsyncSession) -> list[Note]:
    result = await db.execute(select(Note).order_by(Note.id.desc()))
    return list(result.scalars().all())


async def create_note(db: AsyncSession, data: NoteCreate) -> Note:
    if data.author_id is not None:
        await _verify_member_exists(db, data.author_id)

    note = Note(content=data.content, author_id=data.author_id)
    db.add(note)
    await db.flush()
    await db.refresh(note)
    return note


async def update_note(db: AsyncSession, note_id: int, data: NoteUpdate) -> Note:
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    if not note:
        raise NotFoundError("Note", note_id)

    note.content = data.content
    await db.flush()
    await db.refresh(note)
    return note


async def delete_note(db: AsyncSession, note_id: int) -> None:
    result = await db.execute(select(Note).where(Note.id == note_id))
    note = result.scalar_one_or_none()
    if not note:
        raise NotFoundError("Note", note_id)
    await db.delete(note)
