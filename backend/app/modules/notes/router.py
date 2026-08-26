from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.notes import service
from app.modules.notes.schemas import NoteCreate, NoteResponse, NoteUpdate

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("", response_model=list[NoteResponse])
async def list_notes(db: AsyncSession = Depends(get_db)):
    return await service.get_all_notes(db)


@router.post("", response_model=NoteResponse, status_code=201)
async def create_note(data: NoteCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_note(db, data)


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(note_id: int, data: NoteUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update_note(db, note_id, data)


@router.delete("/{note_id}")
async def delete_note(note_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_note(db, note_id)
    return {"message": "Note deleted"}
