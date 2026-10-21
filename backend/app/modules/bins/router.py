from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.bins import service
from app.modules.bins.schemas import (
    BinCreate,
    BinResponse,
    BinScheduleResponse,
    BinSettingsSchema,
    BinUpdate,
)

router = APIRouter(prefix="/bins", tags=["bins"])


@router.get("", response_model=list[BinResponse])
async def list_bins(db: AsyncSession = Depends(get_db)):
    return await service.get_all_bins(db)


@router.post("", response_model=BinResponse, status_code=201)
async def create_bin(data: BinCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_bin(db, data)


# /settings and /schedule must stay above /{bin_id}, otherwise PUT /bins/settings
# is matched by PUT /bins/{bin_id} and fails with 422.
@router.get("/settings", response_model=BinSettingsSchema | None)
async def get_bin_settings(db: AsyncSession = Depends(get_db)):
    return await service.get_settings(db)


@router.put("/settings", response_model=BinSettingsSchema)
async def update_bin_settings(data: BinSettingsSchema, db: AsyncSession = Depends(get_db)):
    return await service.update_settings(db, data)


@router.get("/schedule", response_model=BinScheduleResponse)
async def bin_schedule(
    weeks: int = Query(6, ge=1, le=12),
    db: AsyncSession = Depends(get_db),
):
    return await service.get_schedule(db, weeks)


@router.patch("/{bin_id}/put-out", response_model=BinResponse)
async def toggle_put_out(bin_id: int, db: AsyncSession = Depends(get_db)):
    return await service.toggle_put_out(db, bin_id)


@router.put("/{bin_id}", response_model=BinResponse)
async def update_bin(bin_id: int, data: BinUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update_bin(db, bin_id, data)


@router.delete("/{bin_id}")
async def delete_bin(bin_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_bin(db, bin_id)
    return {"message": "Bin deleted"}
