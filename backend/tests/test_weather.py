import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_weather_response_shape(client):
    response = await client.get("/api/v1/weather")
    assert response.status_code == 200
    data = response.json()
    assert "temperature" in data
    assert "condition" in data
    assert "icon" in data
    assert isinstance(data["temperature"], (int, float))
    assert isinstance(data["condition"], str)
    assert isinstance(data["icon"], str)