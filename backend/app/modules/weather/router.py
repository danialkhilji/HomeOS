from fastapi import APIRouter

from app.modules.weather.schemas import WeatherResponse
from app.modules.weather.service import get_weather

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("", response_model=WeatherResponse)
async def weather():
    return await get_weather()
