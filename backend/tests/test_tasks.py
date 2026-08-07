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


@pytest.fixture
async def member(client):
    response = await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})
    return response.json()


@pytest.mark.asyncio
async def test_list_tasks_empty(client):
    response = await client.get("/api/v1/tasks")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_task_unassigned(client):
    response = await client.post("/api/v1/tasks", json={"title": "Wash dishes"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Wash dishes"
    assert data["assigned_to"] is None
    assert data["is_completed"] is False
    assert data["member"] is None


@pytest.mark.asyncio
async def test_create_task_assigned(client, member):
    response = await client.post("/api/v1/tasks", json={"title": "Vacuum", "assigned_to": member["id"]})
    assert response.status_code == 201
    data = response.json()
    assert data["assigned_to"] == member["id"]
    assert data["member"]["name"] == "Danial"
    assert data["member"]["colour"] == "#2563eb"


@pytest.mark.asyncio
async def test_create_task_invalid_member(client):
    response = await client.post("/api/v1/tasks", json={"title": "Vacuum", "assigned_to": 999})
    assert response.status_code == 404
    assert "not found" in response.json()["error"]


@pytest.mark.asyncio
async def test_list_tasks_filter_by_member(client, member):
    await client.post("/api/v1/tasks", json={"title": "Wash dishes", "assigned_to": member["id"]})
    await client.post("/api/v1/tasks", json={"title": "Vacuum"})

    all_tasks = await client.get("/api/v1/tasks")
    assert len(all_tasks.json()) == 2

    filtered = await client.get(f"/api/v1/tasks?assigned_to={member['id']}")
    assert len(filtered.json()) == 1
    assert filtered.json()[0]["title"] == "Wash dishes"


@pytest.mark.asyncio
async def test_update_task(client, member):
    create = await client.post("/api/v1/tasks", json={"title": "Wash dishes"})
    task_id = create.json()["id"]

    response = await client.put(f"/api/v1/tasks/{task_id}", json={"title": "Clean kitchen", "assigned_to": member["id"]})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Clean kitchen"
    assert data["assigned_to"] == member["id"]


@pytest.mark.asyncio
async def test_update_nonexistent_task(client):
    response = await client.put("/api/v1/tasks/999", json={"title": "Vacuum"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_toggle_task_complete(client):
    create = await client.post("/api/v1/tasks", json={"title": "Wash dishes"})
    task_id = create.json()["id"]

    response = await client.patch(f"/api/v1/tasks/{task_id}/toggle")
    assert response.status_code == 200
    data = response.json()
    assert data["is_completed"] is True
    assert data["completed_at"] is not None


@pytest.mark.asyncio
async def test_toggle_task_uncomplete(client):
    create = await client.post("/api/v1/tasks", json={"title": "Wash dishes"})
    task_id = create.json()["id"]

    await client.patch(f"/api/v1/tasks/{task_id}/toggle")
    response = await client.patch(f"/api/v1/tasks/{task_id}/toggle")
    data = response.json()
    assert data["is_completed"] is False
    assert data["completed_at"] is None


@pytest.mark.asyncio
async def test_toggle_nonexistent_task(client):
    response = await client.patch("/api/v1/tasks/999/toggle")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_task(client):
    create = await client.post("/api/v1/tasks", json={"title": "Wash dishes"})
    task_id = create.json()["id"]

    response = await client.delete(f"/api/v1/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Task deleted"

    list_response = await client.get("/api/v1/tasks")
    assert list_response.json() == []


@pytest.mark.asyncio
async def test_delete_nonexistent_task(client):
    response = await client.delete("/api/v1/tasks/999")
    assert response.status_code == 404
