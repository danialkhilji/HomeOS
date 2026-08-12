from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.shopping.schemas import StoreCreate, StoreUpdate, StoreResponse
from app.modules.shopping import store_service as service

router = APIRouter(prefix="/stores", tags=["stores"])


@router.get("", response_model=list[StoreResponse])
async def list_stores(db: AsyncSession = Depends(get_db)):
    return await service.get_all_stores(db)


@router.post("", response_model=StoreResponse, status_code=201)
async def create_store(data: StoreCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_store(db, data)


@router.put("/{store_id}", response_model=StoreResponse)
async def update_store(store_id: int, data: StoreUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update_store(db, store_id, data)


@router.delete("/{store_id}")
async def delete_store(store_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_store(db, store_id)
    return {"message": "Store deleted"}
