import pytest
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
async def test_tasks_by_date_with_reminder(client):
    await client.post("/api/v1/tasks", json={
        "title": "Dentist",
        "reminder_at": "2026-08-15T14:00:00",
    })
    await client.post("/api/v1/tasks", json={
        "title": "Meeting",
        "reminder_at": "2026-08-16T10:00:00",
    })

    response = await client.get("/api/v1/tasks/by-date?date=2026-08-15")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == "Dentist"


@pytest.mark.asyncio
async def test_tasks_by_date_daily_recurrence(client):
    await client.post("/api/v1/tasks", json={
        "title": "Dishes",
        "recurrence": "daily",
    })

    response = await client.get("/api/v1/tasks/by-date?date=2026-08-15")
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == "Dishes"


@pytest.mark.asyncio
async def test_tasks_by_date_daily_shows_on_any_date(client):
    await client.post("/api/v1/tasks", json={
        "title": "Dishes",
        "recurrence": "daily",
    })

    for date in ["2026-08-15", "2026-08-20", "2026-12-25"]:
        response = await client.get(f"/api/v1/tasks/by-date?date={date}")
        tasks = response.json()
        assert len(tasks) == 1


@pytest.mark.asyncio
async def test_tasks_by_date_monthly_recurrence(client):
    await client.post("/api/v1/tasks", json={
        "title": "Pay rent",
        "recurrence": "monthly",
    })

    tasks_today = (await client.get("/api/v1/tasks")).json()
    created_day = int(tasks_today[0]["created_at"].split("T")[0].split("-")[2])

    response = await client.get(f"/api/v1/tasks/by-date?date=2026-09-{created_day:02d}")
    tasks = response.json()
    assert len(tasks) == 1
    assert tasks[0]["title"] == "Pay rent"


@pytest.mark.asyncio
async def test_tasks_by_date_no_match(client):
    await client.post("/api/v1/tasks", json={
        "title": "Dentist",
        "reminder_at": "2026-08-15T14:00:00",
    })

    response = await client.get("/api/v1/tasks/by-date?date=2026-08-20")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_tasks_by_date_non_recurring_only_today(client):
    await client.post("/api/v1/tasks", json={"title": "Random task"})

    from datetime import date
    today = date.today().isoformat()

    response_today = await client.get(f"/api/v1/tasks/by-date?date={today}")
    assert len(response_today.json()) == 1

    response_other = await client.get("/api/v1/tasks/by-date?date=2026-12-25")
    assert len(response_other.json()) == 0


@pytest.mark.asyncio
async def test_tasks_by_date_mixed(client):
    await client.post("/api/v1/tasks", json={
        "title": "Dentist",
        "reminder_at": "2026-08-15T14:00:00",
    })
    await client.post("/api/v1/tasks", json={
        "title": "Dishes",
        "recurrence": "daily",
    })
    await client.post("/api/v1/tasks", json={
        "title": "Other task",
    })

    response = await client.get("/api/v1/tasks/by-date?date=2026-08-15")
    tasks = response.json()
    titles = [t["title"] for t in tasks]
    assert "Dentist" in titles
    assert "Dishes" in titles
    assert "Other task" not in titles
