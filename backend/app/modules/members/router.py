from fastapi import APIRouter, Depends, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.exceptions import NotFoundError, ValidationError
from app.modules.members import service
from app.modules.members.models import Member
from app.modules.members.schemas import MemberCreate, MemberResponse, MemberUpdate

router = APIRouter(prefix="/members", tags=["members"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024


def _to_response(member) -> dict:
    data = MemberResponse.model_validate(member).model_dump()
    data["avatar_url"] = service.get_avatar_url(member.id)
    return data


@router.get("")
async def list_members(db: AsyncSession = Depends(get_db)):
    members = await service.get_all_members(db)
    return [_to_response(m) for m in members]


@router.post("", status_code=201)
async def create_member(data: MemberCreate, db: AsyncSession = Depends(get_db)):
    member = await service.create_member(db, data)
    return _to_response(member)


@router.put("/{member_id}")
async def update_member(member_id: int, data: MemberUpdate, db: AsyncSession = Depends(get_db)):
    member = await service.update_member(db, member_id, data)
    return _to_response(member)


@router.delete("/{member_id}")
async def delete_member(member_id: int, db: AsyncSession = Depends(get_db)):
    await service.delete_member(db, member_id)
    return {"message": "Member deleted"}


@router.post("/{member_id}/avatar")
async def upload_avatar(member_id: int, file: UploadFile, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Member).where(Member.id == member_id))
    if not result.scalar_one_or_none():
        raise NotFoundError("Member", member_id)

    if file.content_type not in ALLOWED_TYPES:
        raise ValidationError("File must be JPEG, PNG, or WebP")

    file_data = await file.read()
    if len(file_data) > MAX_FILE_SIZE:
        raise ValidationError("File must be under 5MB")

    avatar_url = await service.save_avatar(member_id, file_data)
    return {"avatar_url": avatar_url}


@router.get("/{member_id}/avatar")
async def get_avatar(member_id: int):
    path = service.get_avatar_path(member_id)
    if not path.is_file():
        raise NotFoundError("Avatar", member_id)
    return FileResponse(path, media_type="image/jpeg")


@router.delete("/{member_id}/avatar")
async def delete_avatar(member_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Member).where(Member.id == member_id))
    if not result.scalar_one_or_none():
        raise NotFoundError("Member", member_id)

    service.delete_avatar(member_id)
    return {"message": "Avatar deleted"}