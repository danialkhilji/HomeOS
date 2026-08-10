from fastapi import APIRouter

from app.modules.prayer.schemas import PrayerTimesResponse
from app.modules.prayer.service import get_prayer_times

router = APIRouter(prefix="/prayer-times", tags=["prayer"])


@router.get("", response_model=PrayerTimesResponse)
async def prayer_times():
    return await get_prayer_times()