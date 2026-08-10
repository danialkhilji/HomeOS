from pydantic import BaseModel


class PrayerTime(BaseModel):
    name: str
    time: str


class PrayerTimesResponse(BaseModel):
    prayers: list[PrayerTime]
    current_prayer: str | None = None
    hijri_date: str | None = None