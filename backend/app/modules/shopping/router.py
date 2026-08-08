from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.shopping.schemas import ShoppingItemCreate, ShoppingItemUpdate, ShoppingItemResponse
from app.modules.shopping import service

router = APIRouter(prefix="/shopping", tags=["shopping"])


@router.get("", response_model=list[ShoppingItemResponse])
async def list_items(db: AsyncSession = Depends(get_db)):
    return await service.get_all_items(db)


@router.post("", response_model=ShoppingItemResponse, status_code=201)
async def create_item(data: ShoppingItemCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_item(db, data)


@router.put("/{item_id}", response_model=ShoppingItemResponse)
async def update_item(item_id: int, data: ShoppingItemUpdate, db: AsyncSession = Depends(get_db)):
    return await service.update_item(db, item_id, data)


@router.patch("/{item_id}/toggle", response_model=ShoppingItemResponse)
async def toggle_item(item_id: int, db: AsyncSession = Depends(get_db)):
    return await service.toggle_item(db, item_id)


@router.delete("/{item_id}")
async def delete_item(item_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_item(db, item_id)
    return {"message": "Shopping item deleted"}
