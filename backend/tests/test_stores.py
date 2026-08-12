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
async def test_list_stores_empty(client):
    response = await client.get("/api/v1/stores")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_store(client):
    response = await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#2563eb"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Aldi"
    assert data["colour"] == "#2563eb"


@pytest.mark.asyncio
async def test_create_duplicate_store(client):
    await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#2563eb"})
    response = await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#16a34a"})
    assert response.status_code == 422
    assert "already exists" in response.json()["error"]


@pytest.mark.asyncio
async def test_update_store(client):
    create = await client.post("/api/v1/stores", json={"name": "Alid", "colour": "#2563eb"})
    store_id = create.json()["id"]

    response = await client.put(f"/api/v1/stores/{store_id}", json={"name": "Aldi", "colour": "#2563eb"})
    assert response.status_code == 200
    assert response.json()["name"] == "Aldi"


@pytest.mark.asyncio
async def test_update_store_duplicate_name(client):
    await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#2563eb"})
    create2 = await client.post("/api/v1/stores", json={"name": "Tesco", "colour": "#16a34a"})
    tesco_id = create2.json()["id"]

    response = await client.put(f"/api/v1/stores/{tesco_id}", json={"name": "Aldi", "colour": "#16a34a"})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_update_nonexistent_store(client):
    response = await client.put("/api/v1/stores/999", json={"name": "Aldi", "colour": "#2563eb"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_store(client):
    create = await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#2563eb"})
    store_id = create.json()["id"]

    response = await client.delete(f"/api/v1/stores/{store_id}")
    assert response.status_code == 200

    stores = (await client.get("/api/v1/stores")).json()
    assert stores == []


@pytest.mark.asyncio
async def test_delete_nonexistent_store(client):
    response = await client.delete("/api/v1/stores/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_create_item_with_store(client):
    store = (await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#2563eb"})).json()
    response = await client.post("/api/v1/shopping", json={"name": "Milk", "store_id": store["id"]})
    assert response.status_code == 201
    data = response.json()
    assert data["store_id"] == store["id"]
    assert data["store"]["name"] == "Aldi"


@pytest.mark.asyncio
async def test_create_item_without_store(client):
    response = await client.post("/api/v1/shopping", json={"name": "Eggs"})
    assert response.status_code == 201
    data = response.json()
    assert data["store_id"] is None
    assert data["store"] is None


@pytest.mark.asyncio
async def test_create_item_invalid_store(client):
    response = await client.post("/api/v1/shopping", json={"name": "Milk", "store_id": 999})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_item_store(client):
    store = (await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#2563eb"})).json()
    item = (await client.post("/api/v1/shopping", json={"name": "Milk"})).json()

    response = await client.put(f"/api/v1/shopping/{item['id']}", json={"name": "Milk", "store_id": store["id"]})
    assert response.status_code == 200
    assert response.json()["store"]["name"] == "Aldi"


@pytest.mark.asyncio
async def test_delete_store_unassigns_items(client):
    store = (await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#2563eb"})).json()
    await client.post("/api/v1/shopping", json={"name": "Milk", "store_id": store["id"]})
    await client.post("/api/v1/shopping", json={"name": "Eggs", "store_id": store["id"]})

    await client.delete(f"/api/v1/stores/{store['id']}")

    items = (await client.get("/api/v1/shopping")).json()
    assert len(items) == 2
    for item in items:
        assert item["store_id"] is None
        assert item["store"] is None


@pytest.mark.asyncio
async def test_toggle_item_keeps_store(client):
    store = (await client.post("/api/v1/stores", json={"name": "Aldi", "colour": "#2563eb"})).json()
    item = (await client.post("/api/v1/shopping", json={"name": "Milk", "store_id": store["id"]})).json()

    response = await client.patch(f"/api/v1/shopping/{item['id']}/toggle")
    assert response.json()["is_purchased"] is True
    assert response.json()["store_id"] == store["id"]
    assert response.json()["store"]["name"] == "Aldi"
