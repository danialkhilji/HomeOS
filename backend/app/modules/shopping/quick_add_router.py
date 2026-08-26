from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.shopping import quick_add_service as service
from app.modules.shopping.quick_add_schemas import QuickAddItemCreate, QuickAddItemResponse

router = APIRouter(prefix="/quick-add", tags=["quick-add"])


@router.get("", response_model=list[QuickAddItemResponse])
async def list_quick_add_items(db: AsyncSession = Depends(get_db)):
    return await service.get_all_quick_add_items(db)


@router.post("", response_model=QuickAddItemResponse, status_code=201)
async def create_quick_add_item(data: QuickAddItemCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_quick_add_item(db, data)


@router.delete("/{item_id}")
async def delete_quick_add_item(item_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_quick_add_item(db, item_id)
    return {"message": "Quick add item deleted"}
