import pytest
from datetime import date
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.database import Base, engine


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


@pytest.mark.asyncio
async def test_calendar_by_date_response_shape(client):
    today = date.today().isoformat()
    response = await client.get(f"/api/v1/calendar/by-date?date={today}")
    assert response.status_code == 200
    data = response.json()
    assert "date" in data
    assert "tasks" in data
    assert "birthdays" in data
    assert isinstance(data["tasks"], list)
    assert isinstance(data["birthdays"], list)


@pytest.mark.asyncio
async def test_calendar_by_date_includes_tasks(client):
    await client.post("/api/v1/tasks", json={"title": "Dishes", "recurrence": "daily"})

    response = await client.get("/api/v1/calendar/by-date?date=2026-08-15")
    data = response.json()
    assert len(data["tasks"]) == 1
    assert data["tasks"][0]["title"] == "Dishes"


@pytest.mark.asyncio
async def test_calendar_by_date_includes_birthdays(client):
    await client.post("/api/v1/birthdays", json={"name": "Danial", "month": 8, "day": 15})

    response = await client.get("/api/v1/calendar/by-date?date=2026-08-15")
    data = response.json()
    assert len(data["birthdays"]) == 1
    assert data["birthdays"][0]["name"] == "Danial"


@pytest.mark.asyncio
async def test_calendar_by_date_includes_both(client):
    await client.post("/api/v1/tasks", json={"title": "Dishes", "recurrence": "daily"})
    await client.post("/api/v1/tasks", json={
        "title": "Dentist",
        "reminder_at": "2026-08-15T14:00:00",
    })
    await client.post("/api/v1/birthdays", json={"name": "Danial", "month": 8, "day": 15})
    await client.post("/api/v1/birthdays", json={"name": "Uncle Ahmed", "month": 8, "day": 15})

    response = await client.get("/api/v1/calendar/by-date?date=2026-08-15")
    data = response.json()
    assert len(data["tasks"]) == 2
    assert len(data["birthdays"]) == 2
    assert data["date"] == "2026-08-15"


@pytest.mark.asyncio
async def test_calendar_by_date_empty(client):
    response = await client.get("/api/v1/calendar/by-date?date=2026-12-25")
    data = response.json()
    assert data["tasks"] == []
    assert data["birthdays"] == []


@pytest.mark.asyncio
async def test_calendar_by_date_no_cross_contamination(client):
    await client.post("/api/v1/tasks", json={
        "title": "Dentist",
        "reminder_at": "2026-08-15T14:00:00",
    })
    await client.post("/api/v1/birthdays", json={"name": "Danial", "month": 8, "day": 20})

    response_15 = await client.get("/api/v1/calendar/by-date?date=2026-08-15")
    assert len(response_15.json()["tasks"]) == 1
    assert len(response_15.json()["birthdays"]) == 0

    response_20 = await client.get("/api/v1/calendar/by-date?date=2026-08-20")
    assert len(response_20.json()["tasks"]) == 0
    assert len(response_20.json()["birthdays"]) == 1
