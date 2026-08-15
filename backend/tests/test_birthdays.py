import pytest
from datetime import date
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
async def test_list_birthdays_empty(client):
    response = await client.get("/api/v1/birthdays")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_birthday(client):
    response = await client.post("/api/v1/birthdays", json={"name": "Danial", "month": 3, "day": 15})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Danial"
    assert data["month"] == 3
    assert data["day"] == 15


@pytest.mark.asyncio
async def test_birthdays_by_date(client):
    await client.post("/api/v1/birthdays", json={"name": "Danial", "month": 8, "day": 15})
    await client.post("/api/v1/birthdays", json={"name": "Ali", "month": 8, "day": 20})

    response = await client.get("/api/v1/birthdays/by-date?month=8&day=15")
    assert response.status_code == 200
    birthdays = response.json()
    assert len(birthdays) == 1
    assert birthdays[0]["name"] == "Danial"


@pytest.mark.asyncio
async def test_birthdays_by_date_no_match(client):
    await client.post("/api/v1/birthdays", json={"name": "Danial", "month": 8, "day": 15})

    response = await client.get("/api/v1/birthdays/by-date?month=12&day=25")
    assert response.json() == []


@pytest.mark.asyncio
async def test_upcoming_birthdays(client):
    today = date.today()
    tomorrow_month = today.month
    tomorrow_day = today.day + 1
    if tomorrow_day > 28:
        tomorrow_month = today.month + 1 if today.month < 12 else 1
        tomorrow_day = 1

    await client.post("/api/v1/birthdays", json={"name": "Danial", "month": tomorrow_month, "day": tomorrow_day})
    await client.post("/api/v1/birthdays", json={"name": "Ali", "month": 1, "day": 1})

    response = await client.get("/api/v1/birthdays/upcoming?days=7")
    assert response.status_code == 200
    upcoming = response.json()
    names = [b["name"] for b in upcoming]
    assert "Danial" in names


@pytest.mark.asyncio
async def test_upcoming_birthdays_today(client):
    today = date.today()
    await client.post("/api/v1/birthdays", json={"name": "Danial", "month": today.month, "day": today.day})

    response = await client.get("/api/v1/birthdays/upcoming?days=7")
    upcoming = response.json()
    assert len(upcoming) == 1
    assert upcoming[0]["name"] == "Danial"
    assert upcoming[0]["days_until"] == 0


@pytest.mark.asyncio
async def test_delete_birthday(client):
    create = await client.post("/api/v1/birthdays", json={"name": "Danial", "month": 3, "day": 15})
    birthday_id = create.json()["id"]

    response = await client.delete(f"/api/v1/birthdays/{birthday_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Birthday deleted"

    list_response = await client.get("/api/v1/birthdays")
    assert list_response.json() == []


@pytest.mark.asyncio
async def test_delete_nonexistent_birthday(client):
    response = await client.delete("/api/v1/birthdays/999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_multiple_birthdays_same_date(client):
    await client.post("/api/v1/birthdays", json={"name": "Danial", "month": 8, "day": 15})
    await client.post("/api/v1/birthdays", json={"name": "Uncle Ahmed", "month": 8, "day": 15})

    response = await client.get("/api/v1/birthdays/by-date?month=8&day=15")
    assert len(response.json()) == 2
