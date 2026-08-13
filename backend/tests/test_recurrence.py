import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.database import Base, engine, async_session_factory
from app.modules.tasks.recurrence import reset_recurring_tasks


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
async def test_daily_recurrence_resets_completed(client):
    task = (await client.post("/api/v1/tasks", json={"title": "Dishes", "recurrence": "daily"})).json()
    await client.patch(f"/api/v1/tasks/{task['id']}/toggle")

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["is_completed"] is True

    async with async_session_factory() as session:
        await reset_recurring_tasks(session)
        await session.commit()

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["is_completed"] is False
    assert tasks[0]["completed_at"] is None


@pytest.mark.asyncio
async def test_daily_recurrence_skips_incomplete(client):
    await client.post("/api/v1/tasks", json={"title": "Dishes", "recurrence": "daily"})

    async with async_session_factory() as session:
        await reset_recurring_tasks(session)
        await session.commit()

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["is_completed"] is False


@pytest.mark.asyncio
async def test_non_recurring_task_not_reset(client):
    task = (await client.post("/api/v1/tasks", json={"title": "Dishes", "recurrence": "none"})).json()
    await client.patch(f"/api/v1/tasks/{task['id']}/toggle")

    async with async_session_factory() as session:
        await reset_recurring_tasks(session)
        await session.commit()

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["is_completed"] is True


@pytest.mark.asyncio
async def test_recurrence_preserves_task_data(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    task = (await client.post("/api/v1/tasks", json={
        "title": "Dishes",
        "assigned_to": member["id"],
        "recurrence": "daily",
    })).json()
    await client.patch(f"/api/v1/tasks/{task['id']}/toggle")

    async with async_session_factory() as session:
        await reset_recurring_tasks(session)
        await session.commit()

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["title"] == "Dishes"
    assert tasks[0]["assigned_to"] == member["id"]
    assert tasks[0]["recurrence"] == "daily"
    assert tasks[0]["is_completed"] is False
