from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.calendar.calendar_schemas import CalendarDateResponse
from app.modules.calendar.calendar_service import get_calendar_by_date

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("/by-date", response_model=CalendarDateResponse)
async def calendar_by_date(
    date: date = Query(...),
    db: AsyncSession = Depends(get_db),
):
    return await get_calendar_by_date(db, date)
