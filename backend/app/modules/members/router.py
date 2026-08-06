from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.members.schemas import MemberCreate, MemberResponse
from app.modules.members import service

router = APIRouter(prefix="/members", tags=["members"])


@router.get("", response_model=list[MemberResponse])
async def list_members(db: AsyncSession = Depends(get_db)):
    return await service.get_all_members(db)


@router.post("", response_model=MemberResponse, status_code=201)
async def create_member(data: MemberCreate, db: AsyncSession = Depends(get_db)):
    return await service.create_member(db, data)


@router.delete("/{member_id}")
async def delete_member(member_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_member(db, member_id)
    return {"message": "Member deleted"}
