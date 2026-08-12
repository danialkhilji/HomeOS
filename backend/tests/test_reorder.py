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
async def test_reorder_tasks(client):
    t1 = (await client.post("/api/v1/tasks", json={"title": "First"})).json()
    t2 = (await client.post("/api/v1/tasks", json={"title": "Second"})).json()
    t3 = (await client.post("/api/v1/tasks", json={"title": "Third"})).json()

    response = await client.patch("/api/v1/tasks/reorder", json={"ids": [t3["id"], t1["id"], t2["id"]]})
    assert response.status_code == 200

    tasks = (await client.get("/api/v1/tasks")).json()
    assert tasks[0]["title"] == "Third"
    assert tasks[1]["title"] == "First"
    assert tasks[2]["title"] == "Second"


@pytest.mark.asyncio
async def test_reorder_ignores_invalid_ids(client):
    t1 = (await client.post("/api/v1/tasks", json={"title": "First"})).json()
    await client.post("/api/v1/tasks", json={"title": "Second"})

    response = await client.patch("/api/v1/tasks/reorder", json={"ids": [999, t1["id"]]})
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_reorder_shopping(client):
    i1 = (await client.post("/api/v1/shopping", json={"name": "Milk"})).json()
    i2 = (await client.post("/api/v1/shopping", json={"name": "Eggs"})).json()
    i3 = (await client.post("/api/v1/shopping", json={"name": "Bread"})).json()

    response = await client.patch("/api/v1/shopping/reorder", json={"ids": [i3["id"], i1["id"], i2["id"]]})
    assert response.status_code == 200

    items = (await client.get("/api/v1/shopping")).json()
    assert items[0]["name"] == "Bread"
    assert items[1]["name"] == "Milk"
    assert items[2]["name"] == "Eggs"


@pytest.mark.asyncio
async def test_reorder_empty_ids(client):
    response = await client.patch("/api/v1/tasks/reorder", json={"ids": []})
    assert response.status_code == 422
