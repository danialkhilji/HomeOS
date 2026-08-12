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
async def test_list_quick_add_empty(client):
    response = await client.get("/api/v1/quick-add")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_quick_add_item(client):
    response = await client.post("/api/v1/quick-add", json={"name": "Milk", "emoji": "🥛"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Milk"
    assert data["emoji"] == "🥛"
    assert data["sort_order"] == 0


@pytest.mark.asyncio
async def test_create_multiple_items_incrementing_order(client):
    await client.post("/api/v1/quick-add", json={"name": "Milk", "emoji": "🥛"})
    response = await client.post("/api/v1/quick-add", json={"name": "Eggs", "emoji": "🥚"})
    assert response.json()["sort_order"] == 1


@pytest.mark.asyncio
async def test_list_quick_add_items(client):
    await client.post("/api/v1/quick-add", json={"name": "Milk", "emoji": "🥛"})
    await client.post("/api/v1/quick-add", json={"name": "Eggs", "emoji": "🥚"})

    response = await client.get("/api/v1/quick-add")
    items = response.json()
    assert len(items) == 2
    assert items[0]["name"] == "Milk"
    assert items[1]["name"] == "Eggs"


@pytest.mark.asyncio
async def test_delete_quick_add_item(client):
    create = await client.post("/api/v1/quick-add", json={"name": "Milk", "emoji": "🥛"})
    item_id = create.json()["id"]

    response = await client.delete(f"/api/v1/quick-add/{item_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Quick add item deleted"

    items = (await client.get("/api/v1/quick-add")).json()
    assert items == []


@pytest.mark.asyncio
async def test_delete_nonexistent_quick_add_item(client):
    response = await client.delete("/api/v1/quick-add/999")
    assert response.status_code == 404
