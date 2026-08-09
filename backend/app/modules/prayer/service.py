from datetime import datetime

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.modules.prayer.schemas import PrayerTime, PrayerTimesResponse

logger = get_logger(__name__)

ALADHAN_URL = "https://api.aladhan.com/v1/timings"
PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

_cache: PrayerTimesResponse | None = None


def _to_12h(time_24h: str) -> str:
    hour, minute = map(int, time_24h.split(":"))
    period = "AM" if hour < 12 else "PM"
    display_hour = hour % 12 or 12
    return f"{display_hour}:{minute:02d} {period}"


def _to_minutes(prayer: PrayerTime) -> int:
    time_str = prayer.time.replace(" AM", "").replace(" PM", "")
    hour, minute = map(int, time_str.split(":"))
    if "PM" in prayer.time and hour != 12:
        hour += 12
    if "AM" in prayer.time and hour == 12:
        hour = 0
    return hour * 60 + minute


def _find_current_prayer(prayers: list[PrayerTime]) -> str | None:
    now = datetime.now()
    current_minutes = now.hour * 60 + now.minute

    current = None
    for prayer in prayers:
        if _to_minutes(prayer) <= current_minutes:
            current = prayer.name

    return current


async def fetch_prayer_times() -> PrayerTimesResponse:
    global _cache

    try:
        params = {
            "latitude": settings.WEATHER_LATITUDE,
            "longitude": settings.WEATHER_LONGITUDE,
            "method": 15,
            "school": 1,
        }

        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(ALADHAN_URL, params=params)
            response.raise_for_status()
            data = response.json()

        timings = data["data"]["timings"]
        prayers = []
        for name in PRAYER_NAMES:
            raw_time = timings.get(name, "")
            if raw_time:
                clean_time = raw_time.split(" ")[0]
                prayers.append(PrayerTime(name=name, time=_to_12h(clean_time)))

        current_prayer = _find_current_prayer(prayers)
        _cache = PrayerTimesResponse(prayers=prayers, current_prayer=current_prayer)
        logger.info("Prayer times updated: %d prayers fetched", len(prayers))

    except Exception:
        logger.exception("Failed to fetch prayer times")
        if _cache is None:
            _cache = PrayerTimesResponse(prayers=[], current_prayer=None)

    return _cache


async def get_prayer_times() -> PrayerTimesResponse:
    if _cache is not None:
        return PrayerTimesResponse(
            prayers=_cache.prayers,
            current_prayer=_find_current_prayer(_cache.prayers),
        )
    return await fetch_prayer_times()