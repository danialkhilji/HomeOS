from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.birthdays.schemas import BirthdayCreate, BirthdayResponse, UpcomingBirthdayResponse
from app.modules.birthdays import service

router = APIRouter(prefix="/birthdays", tags=["birthdays"])


@router.get("", response_model=list[BirthdayResponse])
async def list_birthdays(db: AsyncSession = Depends(get_db)):
    return await service.get_all_birthdays(db)


@router.get("/upcoming", response_model=list[UpcomingBirthdayResponse])
async def upcoming_birthdays(
    days: int = Query(7, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_upcoming_birthdays(db, days)


@router.get("/by-date", response_model=list[BirthdayResponse])
async def birthdays_by_date(
    month: int = Query(..., ge=1, le=12),
    day: int = Query(..., ge=1, le=31),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_birthdays_by_date(db, month, day)


@router.post("", response_model=BirthdayResponse, status_code=201)
async def create_birthday(data: BirthdayCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_birthday(db, data)


@router.delete("/{birthday_id}")
async def delete_birthday(birthday_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_birthday(db, birthday_id)
    return {"message": "Birthday deleted"}
