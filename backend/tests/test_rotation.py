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


async def create_member(client, name, colour):
    response = await client.post("/api/v1/members", json={"name": name, "colour": colour})
    return response.json()


async def create_task(client, title, assigned_to=None):
    payload = {"title": title}
    if assigned_to is not None:
        payload["assigned_to"] = assigned_to
    response = await client.post("/api/v1/tasks", json=payload)
    return response.json()


@pytest.mark.asyncio
async def test_rotation_shifts_assignments(client):
    danial = await create_member(client, "Danial", "#2563eb")
    ali = await create_member(client, "Ali", "#16a34a")

    await create_task(client, "Dishes", danial["id"])
    await create_task(client, "Vacuum", ali["id"])

    response = await client.post("/api/v1/tasks/rotate")
    assert response.status_code == 200

    tasks = (await client.get("/api/v1/tasks")).json()
    assignments = {t["title"]: t["assigned_to"] for t in tasks}
    assert assignments["Dishes"] == ali["id"]
    assert assignments["Vacuum"] == danial["id"]


@pytest.mark.asyncio
async def test_rotation_resets_completion(client):
    danial = await create_member(client, "Danial", "#2563eb")
    task = await create_task(client, "Dishes", danial["id"])

    await client.patch(f"/api/v1/tasks/{task['id']}/toggle")

    await client.post("/api/v1/tasks/rotate")

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["is_completed"] is False
    assert tasks[0]["completed_at"] is None


@pytest.mark.asyncio
async def test_rotation_assigns_unassigned_tasks(client):
    danial = await create_member(client, "Danial", "#2563eb")
    await create_task(client, "Dishes")

    await client.post("/api/v1/tasks/rotate")

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["assigned_to"] == danial["id"]


@pytest.mark.asyncio
async def test_rotation_more_tasks_than_members(client):
    danial = await create_member(client, "Danial", "#2563eb")

    await create_task(client, "Dishes", danial["id"])
    await create_task(client, "Vacuum", danial["id"])

    await client.post("/api/v1/tasks/rotate")

    tasks = (await client.get("/api/v1/tasks")).json()
    for task in tasks:
        assert task["assigned_to"] == danial["id"]


@pytest.mark.asyncio
async def test_rotation_no_members(client):
    await create_task(client, "Dishes")

    response = await client.post("/api/v1/tasks/rotate")
    assert response.status_code == 200

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["assigned_to"] is None


@pytest.mark.asyncio
async def test_rotation_no_tasks(client):
    await create_member(client, "Danial", "#2563eb")

    response = await client.post("/api/v1/tasks/rotate")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_double_rotation_cycles_back(client):
    danial = await create_member(client, "Danial", "#2563eb")
    ali = await create_member(client, "Ali", "#16a34a")

    await create_task(client, "Dishes", danial["id"])

    await client.post("/api/v1/tasks/rotate")
    await client.post("/api/v1/tasks/rotate")

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["assigned_to"] == danial["id"]
