import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_health_returns_200(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_health_response_structure(client):
    response = await client.get("/api/v1/health")
    data = response.json()

    assert data["app"] == "HomeOS"
    assert data["version"] == "1.1"
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
