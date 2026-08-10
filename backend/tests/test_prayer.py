import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_prayer_times_response_shape(client):
    response = await client.get("/api/v1/prayer-times")
    assert response.status_code == 200
    data = response.json()
    assert "prayers" in data
    assert "current_prayer" in data
    assert "hijri_date" in data
    assert isinstance(data["prayers"], list)
    assert len(data["prayers"]) == 5
    for prayer in data["prayers"]:
        assert "name" in prayer
        assert "time" in prayer
        assert prayer["name"] in ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]