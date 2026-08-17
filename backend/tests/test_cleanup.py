import pytest
from datetime import datetime, timedelta, timezone
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.core.database import Base, engine, async_session_factory
from app.modules.cleanup.service import cleanup_old_records
from app.modules.tasks.models import Task
from app.modules.shopping.models import ShoppingItem
from app.modules.notes.models import Note


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
async def test_cleanup_deletes_old_completed_tasks(client):
    task = (await client.post("/api/v1/tasks", json={"title": "Old task"})).json()
    await client.patch(f"/api/v1/tasks/{task['id']}/toggle")

    async with async_session_factory() as session:
        from sqlalchemy import select, update
        result = await session.execute(select(Task).where(Task.id == task["id"]))
        t = result.scalar_one()
        t.completed_at = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=366)
        await session.commit()

    async with async_session_factory() as session:
        await cleanup_old_records(session)
        await session.commit()

    tasks = (await client.get("/api/v1/tasks")).json()
    assert len(tasks) == 0


@pytest.mark.asyncio
async def test_cleanup_keeps_recent_completed_tasks(client):
    task = (await client.post("/api/v1/tasks", json={"title": "Recent task"})).json()
    await client.patch(f"/api/v1/tasks/{task['id']}/toggle")

    async with async_session_factory() as session:
        await cleanup_old_records(session)
        await session.commit()

    tasks = (await client.get("/api/v1/tasks")).json()
    assert len(tasks) == 1


@pytest.mark.asyncio
async def test_cleanup_keeps_incomplete_old_tasks(client):
    await client.post("/api/v1/tasks", json={"title": "Old but incomplete"})

    async with async_session_factory() as session:
        await cleanup_old_records(session)
        await session.commit()

    tasks = (await client.get("/api/v1/tasks")).json()
    assert len(tasks) == 1


@pytest.mark.asyncio
async def test_cleanup_deletes_old_purchased_shopping(client):
    item = (await client.post("/api/v1/shopping", json={"name": "Old milk"})).json()
    await client.patch(f"/api/v1/shopping/{item['id']}/toggle")

    async with async_session_factory() as session:
        from sqlalchemy import select
        result = await session.execute(select(ShoppingItem).where(ShoppingItem.id == item["id"]))
        si = result.scalar_one()
        si.created_at = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=366)
        await session.commit()

    async with async_session_factory() as session:
        await cleanup_old_records(session)
        await session.commit()

    items = (await client.get("/api/v1/shopping")).json()
    assert len(items) == 0


@pytest.mark.asyncio
async def test_cleanup_keeps_unpurchased_old_shopping(client):
    await client.post("/api/v1/shopping", json={"name": "Old but needed"})

    async with async_session_factory() as session:
        from sqlalchemy import select
        result = await session.execute(select(ShoppingItem))
        si = result.scalar_one()
        si.created_at = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=366)
        await session.commit()

    async with async_session_factory() as session:
        await cleanup_old_records(session)
        await session.commit()

    items = (await client.get("/api/v1/shopping")).json()
    assert len(items) == 1


@pytest.mark.asyncio
async def test_cleanup_deletes_old_notes(client):
    await client.post("/api/v1/notes", json={"content": "Old note"})

    async with async_session_factory() as session:
        from sqlalchemy import select
        result = await session.execute(select(Note))
        note = result.scalar_one()
        note.created_at = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=366)
        await session.commit()

    async with async_session_factory() as session:
        await cleanup_old_records(session)
        await session.commit()

    notes = (await client.get("/api/v1/notes")).json()
    assert len(notes) == 0


@pytest.mark.asyncio
async def test_cleanup_keeps_recent_notes(client):
    await client.post("/api/v1/notes", json={"content": "Recent note"})

    async with async_session_factory() as session:
        await cleanup_old_records(session)
        await session.commit()

    notes = (await client.get("/api/v1/notes")).json()
    assert len(notes) == 1