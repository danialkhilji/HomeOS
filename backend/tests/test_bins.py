from datetime import date, timedelta

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import func, select

from app.core.database import Base, async_session_factory, engine
from app.main import app
from app.modules.bins.models import Bin, BinSettings
from app.modules.bins.service import compute_schedule

# Reference week: Monday 2026-10-19 to Sunday 2026-10-25, collection day Tuesday.
MONDAY = date(2026, 10, 19)
TUESDAY = date(2026, 10, 20)
WEDNESDAY = date(2026, 10, 21)
TUE = 1


@pytest.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


def make_bin(bin_id, schedule, name=None):
    return Bin(
        id=bin_id,
        name=name or f"Bin {bin_id}",
        colour="#6b7280",
        icon="general",
        schedule=schedule,
    )


def make_settings(weekday, week_a_date):
    return BinSettings(id=1, collection_weekday=weekday, week_a_date=week_a_date)


def bin_payload(**overrides):
    payload = {"name": "General Waste", "colour": "#374151", "icon": "general", "schedule": "weekly"}
    payload.update(overrides)
    return payload


def next_weekday(weekday):
    today = date.today()
    return today + timedelta(days=(weekday - today.weekday()) % 7)


# --- CRUD ---


@pytest.mark.asyncio
async def test_list_bins_empty(client):
    response = await client.get("/api/v1/bins")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_bin(client):
    response = await client.post("/api/v1/bins", json=bin_payload(icon="recycling", schedule="week_a"))
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "General Waste"
    assert data["colour"] == "#374151"
    assert data["icon"] == "recycling"
    assert data["schedule"] == "week_a"
    assert data["id"] > 0
    assert data["created_at"]


@pytest.mark.asyncio
async def test_create_bin_strips_name(client):
    response = await client.post("/api/v1/bins", json=bin_payload(name="  Recycling  "))
    assert response.status_code == 201
    assert response.json()["name"] == "Recycling"


@pytest.mark.asyncio
async def test_list_bins_ordered_by_id(client):
    await client.post("/api/v1/bins", json=bin_payload(name="Recycling"))
    await client.post("/api/v1/bins", json=bin_payload(name="Garden"))
    await client.post("/api/v1/bins", json=bin_payload(name="Food"))

    bins = (await client.get("/api/v1/bins")).json()
    assert [b["name"] for b in bins] == ["Recycling", "Garden", "Food"]
    assert [b["id"] for b in bins] == sorted(b["id"] for b in bins)


@pytest.mark.asyncio
async def test_update_bin(client):
    create = await client.post("/api/v1/bins", json=bin_payload())
    bin_id = create.json()["id"]

    response = await client.put(f"/api/v1/bins/{bin_id}", json={
        "name": "Recycling",
        "colour": "#2563eb",
        "icon": "paper",
        "schedule": "week_b",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == bin_id
    assert data["name"] == "Recycling"
    assert data["colour"] == "#2563eb"
    assert data["icon"] == "paper"
    assert data["schedule"] == "week_b"


@pytest.mark.asyncio
async def test_update_nonexistent_bin(client):
    response = await client.put("/api/v1/bins/999", json=bin_payload())
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_bin(client):
    create = await client.post("/api/v1/bins", json=bin_payload())
    bin_id = create.json()["id"]

    response = await client.delete(f"/api/v1/bins/{bin_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Bin deleted"

    bins = (await client.get("/api/v1/bins")).json()
    assert bins == []


@pytest.mark.asyncio
async def test_delete_nonexistent_bin(client):
    response = await client.delete("/api/v1/bins/999")
    assert response.status_code == 404


# --- Validation ---


@pytest.mark.asyncio
@pytest.mark.parametrize("icon", ["metal", "glass", "plastic", "cardboard"])
async def test_create_bin_invalid_icon(client, icon):
    response = await client.post("/api/v1/bins", json=bin_payload(icon=icon))
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_bin_invalid_schedule(client):
    response = await client.post("/api/v1/bins", json=bin_payload(schedule="fortnightly"))
    assert response.status_code == 422


@pytest.mark.asyncio
@pytest.mark.parametrize("colour", ["red", "#12345", "#1234567", "#gggggg", "374151"])
async def test_create_bin_bad_colour(client, colour):
    response = await client.post("/api/v1/bins", json=bin_payload(colour=colour))
    assert response.status_code == 422


@pytest.mark.asyncio
@pytest.mark.parametrize("name", ["", "   ", "x" * 101])
async def test_create_bin_invalid_name(client, name):
    response = await client.post("/api/v1/bins", json=bin_payload(name=name))
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_update_bin_invalid_schedule(client):
    create = await client.post("/api/v1/bins", json=bin_payload())
    bin_id = create.json()["id"]

    response = await client.put(f"/api/v1/bins/{bin_id}", json=bin_payload(schedule="monthly"))
    assert response.status_code == 422


@pytest.mark.asyncio
@pytest.mark.parametrize("weekday", [-1, 7])
async def test_settings_weekday_out_of_range(client, weekday):
    response = await client.put("/api/v1/bins/settings", json={
        "collection_weekday": weekday,
        "week_a_date": "2026-10-20",
    })
    assert response.status_code == 422
    assert (await client.get("/api/v1/bins/settings")).json() is None


# --- Settings ---


@pytest.mark.asyncio
async def test_get_settings_before_save_returns_null(client):
    response = await client.get("/api/v1/bins/settings")
    assert response.status_code == 200
    assert response.json() is None


@pytest.mark.asyncio
async def test_put_settings_creates_then_updates_single_row(client):
    first = await client.put("/api/v1/bins/settings", json={
        "collection_weekday": 1,
        "week_a_date": "2026-10-20",
    })
    assert first.status_code == 200
    assert first.json() == {"collection_weekday": 1, "week_a_date": "2026-10-20"}

    second = await client.put("/api/v1/bins/settings", json={
        "collection_weekday": 4,
        "week_a_date": "2026-10-30",
    })
    assert second.status_code == 200
    assert second.json() == {"collection_weekday": 4, "week_a_date": "2026-10-30"}

    response = await client.get("/api/v1/bins/settings")
    assert response.status_code == 200
    assert response.json() == {"collection_weekday": 4, "week_a_date": "2026-10-30"}

    async with async_session_factory() as session:
        count = await session.scalar(select(func.count()).select_from(BinSettings))
    assert count == 1


@pytest.mark.asyncio
async def test_put_settings_not_captured_by_bin_id_route(client):
    await client.post("/api/v1/bins", json=bin_payload())

    response = await client.put("/api/v1/bins/settings", json={
        "collection_weekday": 0,
        "week_a_date": "2026-10-19",
    })
    assert response.status_code == 200
    assert response.json()["collection_weekday"] == 0

    bins = (await client.get("/api/v1/bins")).json()
    assert bins[0]["name"] == "General Waste"


# --- Schedule logic (pure function) ---


def test_schedule_weekly_bins_every_week():
    bins = [make_bin(1, "weekly")]
    result = compute_schedule(bins, make_settings(TUE, TUESDAY), MONDAY, 6)

    assert result.alternating is False
    assert [c.date for c in result.collections] == [TUESDAY + timedelta(weeks=i) for i in range(6)]
    assert [c.week_label for c in result.collections] == ["A", "B", "A", "B", "A", "B"]
    for collection in result.collections:
        assert [b.id for b in collection.bins] == [1]


def test_schedule_alternates_week_a_and_week_b():
    bins = [make_bin(1, "week_a"), make_bin(2, "week_b"), make_bin(3, "weekly")]
    result = compute_schedule(bins, make_settings(TUE, TUESDAY), MONDAY, 4)

    assert result.alternating is True
    assert [c.week_label for c in result.collections] == ["A", "B", "A", "B"]
    assert [[b.id for b in c.bins] for c in result.collections] == [
        [1, 3],
        [2, 3],
        [1, 3],
        [2, 3],
    ]


def test_schedule_bins_ordered_by_id():
    bins = [make_bin(3, "weekly"), make_bin(1, "week_a"), make_bin(2, "weekly")]
    result = compute_schedule(bins, make_settings(TUE, TUESDAY), MONDAY, 1)

    assert [b.id for b in result.collections[0].bins] == [1, 2, 3]


def test_schedule_week_a_date_in_past():
    bins = [make_bin(1, "week_a"), make_bin(2, "week_b")]

    # 26 weeks before TUESDAY: even gap, so TUESDAY is Week A.
    even = compute_schedule(bins, make_settings(TUE, date(2026, 4, 21)), MONDAY, 2)
    assert [c.week_label for c in even.collections] == ["A", "B"]

    # 25 weeks before TUESDAY: odd gap, so TUESDAY is Week B.
    odd = compute_schedule(bins, make_settings(TUE, date(2026, 4, 28)), MONDAY, 2)
    assert [c.week_label for c in odd.collections] == ["B", "A"]
    assert [b.id for b in odd.collections[0].bins] == [2]


def test_schedule_week_a_date_in_future():
    bins = [make_bin(1, "week_a"), make_bin(2, "week_b")]

    # 9 weeks after TUESDAY: odd gap, so TUESDAY is Week B.
    odd = compute_schedule(bins, make_settings(TUE, date(2026, 12, 22)), MONDAY, 2)
    assert [c.week_label for c in odd.collections] == ["B", "A"]

    # 2 weeks after TUESDAY: even gap, so TUESDAY is Week A.
    even = compute_schedule(bins, make_settings(TUE, date(2026, 11, 3)), MONDAY, 2)
    assert [c.week_label for c in even.collections] == ["A", "B"]


def test_schedule_week_a_date_on_different_weekday():
    bins = [make_bin(1, "week_a"), make_bin(2, "week_b")]

    # Saturday and Sunday of the same calendar week as TUESDAY: still Week A.
    for week_a_date in (date(2026, 10, 24), date(2026, 10, 25)):
        result = compute_schedule(bins, make_settings(TUE, week_a_date), MONDAY, 1)
        assert result.collections[0].week_label == "A"

    # Monday of the following week: TUESDAY falls in Week B.
    result = compute_schedule(bins, make_settings(TUE, date(2026, 10, 26)), MONDAY, 1)
    assert result.collections[0].week_label == "B"


def test_schedule_collection_today():
    bins = [make_bin(1, "weekly")]
    result = compute_schedule(bins, make_settings(TUE, TUESDAY), TUESDAY, 2)

    assert result.collections[0].date == TUESDAY
    assert result.collections[0].days_until == 0
    assert result.collections[1].days_until == 7


def test_schedule_collection_tomorrow():
    bins = [make_bin(1, "weekly")]
    result = compute_schedule(bins, make_settings(TUE, TUESDAY), MONDAY, 1)

    assert result.collections[0].date == TUESDAY
    assert result.collections[0].days_until == 1


def test_schedule_rolls_over_day_after_collection():
    bins = [make_bin(1, "weekly")]
    result = compute_schedule(bins, make_settings(TUE, TUESDAY), WEDNESDAY, 1)

    assert result.collections[0].date == date(2026, 10, 27)
    assert result.collections[0].days_until == 6
    assert result.collections[0].week_label == "B"


def test_schedule_skips_weeks_with_no_bins_due():
    bins = [make_bin(1, "week_a")]
    result = compute_schedule(bins, make_settings(TUE, TUESDAY), MONDAY, 6)

    assert [c.date for c in result.collections] == [
        date(2026, 10, 20),
        date(2026, 11, 3),
        date(2026, 11, 17),
    ]
    assert all(c.week_label == "A" for c in result.collections)


def test_schedule_alternating_flag():
    settings = make_settings(TUE, TUESDAY)

    weekly_only = compute_schedule([make_bin(1, "weekly")], settings, MONDAY, 2)
    assert weekly_only.alternating is False

    mixed = compute_schedule([make_bin(1, "weekly"), make_bin(2, "week_b")], settings, MONDAY, 2)
    assert mixed.alternating is True


def test_schedule_empty_without_bins():
    result = compute_schedule([], make_settings(TUE, TUESDAY), MONDAY, 6)
    assert result.alternating is False
    assert result.collections == []


def test_schedule_empty_without_settings():
    result = compute_schedule([make_bin(1, "week_a")], None, MONDAY, 6)
    assert result.alternating is False
    assert result.collections == []


def test_schedule_respects_weeks():
    bins = [make_bin(1, "weekly")]
    settings = make_settings(TUE, TUESDAY)

    assert len(compute_schedule(bins, settings, MONDAY, 1).collections) == 1
    assert len(compute_schedule(bins, settings, MONDAY, 12).collections) == 12


# --- Schedule endpoint ---


@pytest.mark.asyncio
async def test_schedule_endpoint_shape(client):
    general = (await client.post("/api/v1/bins", json=bin_payload(schedule="week_a"))).json()
    food = (await client.post("/api/v1/bins", json=bin_payload(
        name="Food", colour="#16a34a", icon="food", schedule="weekly",
    ))).json()

    first = next_weekday(3)
    await client.put("/api/v1/bins/settings", json={
        "collection_weekday": 3,
        "week_a_date": first.isoformat(),
    })

    response = await client.get("/api/v1/bins/schedule")
    assert response.status_code == 200
    data = response.json()
    assert data["alternating"] is True
    assert len(data["collections"]) == 6

    collection = data["collections"][0]
    assert collection["date"] == first.isoformat()
    assert collection["days_until"] == (first - date.today()).days
    assert collection["week_label"] == "A"
    assert collection["bins"] == [
        {"id": general["id"], "name": "General Waste", "colour": "#374151",
         "icon": "general", "schedule": "week_a"},
        {"id": food["id"], "name": "Food", "colour": "#16a34a", "icon": "food", "schedule": "weekly"},
    ]

    second = data["collections"][1]
    assert second["week_label"] == "B"
    assert [b["id"] for b in second["bins"]] == [food["id"]]


@pytest.mark.asyncio
async def test_schedule_endpoint_weeks_param(client):
    await client.post("/api/v1/bins", json=bin_payload())
    await client.put("/api/v1/bins/settings", json={
        "collection_weekday": 0,
        "week_a_date": next_weekday(0).isoformat(),
    })

    response = await client.get("/api/v1/bins/schedule?weeks=3")
    assert len(response.json()["collections"]) == 3


@pytest.mark.asyncio
async def test_schedule_endpoint_empty_without_settings(client):
    await client.post("/api/v1/bins", json=bin_payload())

    response = await client.get("/api/v1/bins/schedule")
    assert response.status_code == 200
    assert response.json() == {"alternating": False, "collections": []}


@pytest.mark.asyncio
async def test_schedule_endpoint_empty_without_bins(client):
    await client.put("/api/v1/bins/settings", json={
        "collection_weekday": 2,
        "week_a_date": next_weekday(2).isoformat(),
    })

    response = await client.get("/api/v1/bins/schedule")
    assert response.json() == {"alternating": False, "collections": []}


@pytest.mark.asyncio
async def test_deleted_bin_removed_from_schedule(client):
    general = (await client.post("/api/v1/bins", json=bin_payload())).json()
    garden = (await client.post("/api/v1/bins", json=bin_payload(name="Garden", icon="garden"))).json()
    await client.put("/api/v1/bins/settings", json={
        "collection_weekday": 4,
        "week_a_date": next_weekday(4).isoformat(),
    })

    before = (await client.get("/api/v1/bins/schedule")).json()
    assert [b["id"] for b in before["collections"][0]["bins"]] == [general["id"], garden["id"]]

    await client.delete(f"/api/v1/bins/{garden['id']}")

    after = (await client.get("/api/v1/bins/schedule")).json()
    for collection in after["collections"]:
        assert [b["id"] for b in collection["bins"]] == [general["id"]]

    await client.delete(f"/api/v1/bins/{general['id']}")

    empty = (await client.get("/api/v1/bins/schedule")).json()
    assert empty == {"alternating": False, "collections": []}


@pytest.mark.asyncio
@pytest.mark.parametrize("weeks", [0, 13])
async def test_schedule_weeks_out_of_range(client, weeks):
    response = await client.get(f"/api/v1/bins/schedule?weeks={weeks}")
    assert response.status_code == 422
