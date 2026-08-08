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
async def test_list_items_empty(client):
    response = await client.get("/api/v1/shopping")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_item(client):
    response = await client.post("/api/v1/shopping", json={"name": "Milk"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Milk"
    assert data["is_purchased"] is False
    assert "id" in data


@pytest.mark.asyncio
async def test_list_items_unpurchased_first(client):
    await client.post("/api/v1/shopping", json={"name": "Milk"})
    eggs = await client.post("/api/v1/shopping", json={"name": "Eggs"})
    await client.post("/api/v1/shopping", json={"name": "Bread"})

    await client.patch(f"/api/v1/shopping/{eggs.json()['id']}/toggle")

    response = await client.get("/api/v1/shopping")
    items = response.json()
    assert items[0]["name"] == "Milk"
    assert items[1]["name"] == "Bread"
    assert items[2]["name"] == "Eggs"
    assert items[2]["is_purchased"] is True


@pytest.mark.asyncio
async def test_update_item(client):
    create = await client.post("/api/v1/shopping", json={"name": "Mlk"})
    item_id = create.json()["id"]

    response = await client.put(f"/api/v1/shopping/{item_id}", json={"name": "Milk"})
    assert response.status_code == 200
    assert response.json()["name"] == "Milk"


@pytest.mark.asyncio
async def test_update_nonexistent_item(client):
    response = await client.put("/api/v1/shopping/999", json={"name": "Milk"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_toggle_item_purchased(client):
    create = await client.post("/api/v1/shopping", json={"name": "Milk"})
    item_id = create.json()["id"]

    response = await client.patch(f"/api/v1/shopping/{item_id}/toggle")
    assert response.status_code == 200
    assert response.json()["is_purchased"] is True


@pytest.mark.asyncio
async def test_toggle_item_unpurchased(client):
    create = await client.post("/api/v1/shopping", json={"name": "Milk"})
    item_id = create.json()["id"]

    await client.patch(f"/api/v1/shopping/{item_id}/toggle")
    response = await client.patch(f"/api/v1/shopping/{item_id}/toggle")
    assert response.json()["is_purchased"] is False


@pytest.mark.asyncio
async def test_toggle_nonexistent_item(client):
    response = await client.patch("/api/v1/shopping/999/toggle")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_item(client):
    create = await client.post("/api/v1/shopping", json={"name": "Milk"})
    item_id = create.json()["id"]

    response = await client.delete(f"/api/v1/shopping/{item_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Shopping item deleted"

    list_response = await client.get("/api/v1/shopping")
    assert list_response.json() == []


@pytest.mark.asyncio
async def test_delete_nonexistent_item(client):
    response = await client.delete("/api/v1/shopping/999")
    assert response.status_code == 404
