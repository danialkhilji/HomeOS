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
async def test_list_members_empty(client):
    response = await client.get("/api/v1/members")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_member(client):
    response = await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Danial"
    assert data["colour"] == "#2563eb"
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_list_members_after_create(client):
    await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})
    await client.post("/api/v1/members", json={"name": "Ali", "colour": "#16a34a"})
    response = await client.get("/api/v1/members")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


@pytest.mark.asyncio
async def test_create_duplicate_member(client):
    await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})
    response = await client.post("/api/v1/members", json={"name": "Danial", "colour": "#16a34a"})
    assert response.status_code == 422
    assert "already exists" in response.json()["error"]


@pytest.mark.asyncio
async def test_delete_member(client):
    create_response = await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})
    member_id = create_response.json()["id"]
    delete_response = await client.delete(f"/api/v1/members/{member_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Member deleted"

    list_response = await client.get("/api/v1/members")
    assert list_response.json() == []


@pytest.mark.asyncio
async def test_delete_nonexistent_member(client):
    response = await client.delete("/api/v1/members/999")
    assert response.status_code == 404
    assert "not found" in response.json()["error"]
