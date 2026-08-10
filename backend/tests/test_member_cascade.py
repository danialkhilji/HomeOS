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
async def test_delete_member_unassigns_tasks(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    await client.post("/api/v1/tasks", json={"title": "Dishes", "assigned_to": member["id"]})
    await client.post("/api/v1/tasks", json={"title": "Vacuum", "assigned_to": member["id"]})

    await client.delete(f"/api/v1/members/{member['id']}")

    tasks = (await client.get("/api/v1/tasks")).json()
    assert len(tasks) == 2
    for task in tasks:
        assert task["assigned_to"] is None
        assert task["member"] is None


@pytest.mark.asyncio
async def test_delete_member_unassigns_notes(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    await client.post("/api/v1/notes", json={"content": "Buy vegetables", "author_id": member["id"]})

    await client.delete(f"/api/v1/members/{member['id']}")

    notes = (await client.get("/api/v1/notes")).json()
    assert len(notes) == 1
    assert notes[0]["author_id"] is None
    assert notes[0]["author"] is None


@pytest.mark.asyncio
async def test_delete_member_preserves_other_assignments(client):
    danial = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    ali = (await client.post("/api/v1/members", json={"name": "Ali", "colour": "#16a34a"})).json()

    await client.post("/api/v1/tasks", json={"title": "Dishes", "assigned_to": danial["id"]})
    await client.post("/api/v1/tasks", json={"title": "Vacuum", "assigned_to": ali["id"]})

    await client.delete(f"/api/v1/members/{danial['id']}")

    tasks = (await client.get("/api/v1/tasks")).json()
    dishes = next(t for t in tasks if t["title"] == "Dishes")
    vacuum = next(t for t in tasks if t["title"] == "Vacuum")

    assert dishes["assigned_to"] is None
    assert vacuum["assigned_to"] == ali["id"]
    assert vacuum["member"]["name"] == "Ali"


@pytest.mark.asyncio
async def test_update_member_reflects_in_tasks_and_notes(client):
    member = (await client.post("/api/v1/members", json={"name": "Danail", "colour": "#2563eb"})).json()
    await client.post("/api/v1/tasks", json={"title": "Dishes", "assigned_to": member["id"]})
    await client.post("/api/v1/notes", json={"content": "Test note", "author_id": member["id"]})

    await client.put(f"/api/v1/members/{member['id']}", json={"name": "Danial", "colour": "#16a34a"})

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["member"]["name"] == "Danial"
    assert tasks[0]["member"]["colour"] == "#16a34a"

    notes = (await client.get("/api/v1/notes")).json()
    assert notes[0]["author"]["name"] == "Danial"
    assert notes[0]["author"]["colour"] == "#16a34a"


@pytest.mark.asyncio
async def test_full_flow_create_assign_rotate(client):
    danial = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    ali = (await client.post("/api/v1/members", json={"name": "Ali", "colour": "#16a34a"})).json()

    await client.post("/api/v1/tasks", json={"title": "Dishes", "assigned_to": danial["id"]})
    await client.post("/api/v1/tasks", json={"title": "Vacuum", "assigned_to": ali["id"]})
    await client.post("/api/v1/shopping", json={"name": "Milk"})
    await client.post("/api/v1/notes", json={"content": "Buy vegetables", "author_id": danial["id"]})

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["member"]["name"] == "Danial"

    await client.post("/api/v1/tasks/rotate")

    tasks = (await client.get("/api/v1/tasks")).json()
    assignments = {t["title"]: t["member"]["name"] for t in tasks}
    assert assignments["Dishes"] == "Ali"
    assert assignments["Vacuum"] == "Danial"

    shopping = (await client.get("/api/v1/shopping")).json()
    assert len(shopping) == 1

    notes = (await client.get("/api/v1/notes")).json()
    assert notes[0]["author"]["name"] == "Danial"
