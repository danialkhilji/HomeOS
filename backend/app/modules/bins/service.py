from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError, ValidationError
from app.modules.bins.models import Bin, BinSettings
from app.modules.bins.schemas import (
    BinCollectionResponse,
    BinCreate,
    BinScheduleResponse,
    BinSettingsSchema,
    BinSummary,
    BinUpdate,
)

SETTINGS_ID = 1


async def get_all_bins(db: AsyncSession) -> list[Bin]:
    result = await db.execute(select(Bin).order_by(Bin.id))
    return list(result.scalars().all())


async def create_bin(db: AsyncSession, data: BinCreate) -> Bin:
    waste_bin = Bin(name=data.name, colour=data.colour, icon=data.icon, schedule=data.schedule)
    db.add(waste_bin)
    await db.flush()
    await db.refresh(waste_bin)
    return waste_bin


async def get_bin(db: AsyncSession, bin_id: int) -> Bin:
    result = await db.execute(select(Bin).where(Bin.id == bin_id))
    waste_bin = result.scalar_one_or_none()
    if not waste_bin:
        raise NotFoundError("Bin", bin_id)
    return waste_bin


async def update_bin(db: AsyncSession, bin_id: int, data: BinUpdate) -> Bin:
    waste_bin = await get_bin(db, bin_id)
    waste_bin.name = data.name
    waste_bin.colour = data.colour
    waste_bin.icon = data.icon
    waste_bin.schedule = data.schedule
    await db.flush()
    await db.refresh(waste_bin)
    return waste_bin


async def delete_bin(db: AsyncSession, bin_id: int) -> None:
    waste_bin = await get_bin(db, bin_id)
    await db.delete(waste_bin)


async def toggle_put_out(db: AsyncSession, bin_id: int) -> Bin:
    waste_bin = await get_bin(db, bin_id)
    bin_settings = await get_settings(db)
    if bin_settings is None:
        raise ValidationError("Choose a collection day before marking bins as put out")

    # Every bin is due at least every other week, so two weeks always reach its next collection
    next_due = compute_schedule([waste_bin], bin_settings, date.today(), weeks=2).collections[0].date
    waste_bin.put_out_date = None if waste_bin.put_out_date == next_due else next_due
    await db.flush()
    await db.refresh(waste_bin)
    return waste_bin


async def get_settings(db: AsyncSession) -> BinSettings | None:
    result = await db.execute(select(BinSettings).where(BinSettings.id == SETTINGS_ID))
    return result.scalar_one_or_none()


async def update_settings(db: AsyncSession, data: BinSettingsSchema) -> BinSettings:
    bin_settings = await get_settings(db)
    if bin_settings is None:
        bin_settings = BinSettings(id=SETTINGS_ID)
        db.add(bin_settings)

    bin_settings.collection_weekday = data.collection_weekday
    bin_settings.week_a_date = data.week_a_date
    await db.flush()
    await db.refresh(bin_settings)
    return bin_settings


def _monday_of(day: date) -> date:
    return day - timedelta(days=day.weekday())


def _summary(waste_bin: Bin, collection_date: date) -> BinSummary:
    summary = BinSummary.model_validate(waste_bin)
    summary.put_out = waste_bin.put_out_date == collection_date
    return summary


def compute_schedule(
    bins: list[Bin],
    bin_settings: BinSettings | None,
    today: date,
    weeks: int,
) -> BinScheduleResponse:
    if bin_settings is None or not bins:
        return BinScheduleResponse(alternating=False, collections=[])

    ordered = sorted(bins, key=lambda b: b.id)
    days_ahead = (bin_settings.collection_weekday - today.weekday()) % 7
    first = today + timedelta(days=days_ahead)
    week_a_monday = _monday_of(bin_settings.week_a_date)

    collections = []
    for i in range(weeks):
        collection_date = first + timedelta(weeks=i)
        week_index = (_monday_of(collection_date) - week_a_monday).days // 7
        week_label = "A" if week_index % 2 == 0 else "B"
        alternate = "week_a" if week_label == "A" else "week_b"

        due = [b for b in ordered if b.schedule in ("weekly", alternate)]
        if not due:
            continue

        collections.append(BinCollectionResponse(
            date=collection_date,
            days_until=(collection_date - today).days,
            week_label=week_label,
            bins=[_summary(b, collection_date) for b in due],
        ))

    return BinScheduleResponse(
        alternating=any(b.schedule != "weekly" for b in bins),
        collections=collections,
    )


async def get_schedule(db: AsyncSession, weeks: int = 6) -> BinScheduleResponse:
    bins = await get_all_bins(db)
    bin_settings = await get_settings(db)
    return compute_schedule(bins, bin_settings, date.today(), weeks)
