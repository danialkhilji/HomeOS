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
async def test_list_notes_empty(client):
    response = await client.get("/api/v1/notes")
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_create_note_without_author(client):
    response = await client.post("/api/v1/notes", json={"content": "Buy vegetables tomorrow"})
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "Buy vegetables tomorrow"
    assert data["author_id"] is None
    assert data["author"] is None


@pytest.mark.asyncio
async def test_create_note_empty_content(client):
    response = await client.post("/api/v1/notes", json={"content": ""})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_create_note_with_author(client, member):
    response = await client.post("/api/v1/notes", json={"content": "Coming home late", "author_id": member["id"]})
    assert response.status_code == 201
    data = response.json()
    assert data["author_id"] == member["id"]
    assert data["author"]["name"] == "Danial"
    assert data["author"]["colour"] == "#2563eb"


@pytest.mark.asyncio
async def test_create_note_invalid_author(client):
    response = await client.post("/api/v1/notes", json={"content": "Test note", "author_id": 999})
    assert response.status_code == 404
    assert "not found" in response.json()["error"]


@pytest.mark.asyncio
async def test_list_notes_newest_first(client):
    await client.post("/api/v1/notes", json={"content": "First note"})
    await client.post("/api/v1/notes", json={"content": "Second note"})
    await client.post("/api/v1/notes", json={"content": "Third note"})

    response = await client.get("/api/v1/notes")
    notes = response.json()
    assert len(notes) == 3
    assert notes[0]["content"] == "Third note"
    assert notes[2]["content"] == "First note"


@pytest.mark.asyncio
async def test_update_note(client):
    create = await client.post("/api/v1/notes", json={"content": "Buy vegeatbles"})
    note_id = create.json()["id"]

    response = await client.put(f"/api/v1/notes/{note_id}", json={"content": "Buy vegetables"})
    assert response.status_code == 200
    assert response.json()["content"] == "Buy vegetables"


@pytest.mark.asyncio
async def test_update_nonexistent_note(client):
    response = await client.put("/api/v1/notes/999", json={"content": "Test"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_note(client):
    create = await client.post("/api/v1/notes", json={"content": "Temporary note"})
    note_id = create.json()["id"]

    response = await client.delete(f"/api/v1/notes/{note_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "Note deleted"

    list_response = await client.get("/api/v1/notes")
    assert list_response.json() == []


@pytest.mark.asyncio
async def test_delete_nonexistent_note(client):
    response = await client.delete("/api/v1/notes/999")
    assert response.status_code == 404
