import io

import pytest
from httpx import ASGITransport, AsyncClient
from PIL import Image

from app.main import app
from app.core.database import Base, engine
from app.modules.members.service import avatar_exists


@pytest.fixture(autouse=True)
async def setup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    from app.modules.members.service import AVATAR_DIR
    import shutil
    if AVATAR_DIR.is_dir():
        shutil.rmtree(AVATAR_DIR)


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
async def test_create_member_invalid_colour(client):
    response = await client.post("/api/v1/members", json={"name": "Danial", "colour": "red"})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_update_member_name(client):
    create = await client.post("/api/v1/members", json={"name": "Danail", "colour": "#2563eb"})
    member_id = create.json()["id"]

    response = await client.put(f"/api/v1/members/{member_id}", json={"name": "Danial", "colour": "#2563eb"})
    assert response.status_code == 200
    assert response.json()["name"] == "Danial"


@pytest.mark.asyncio
async def test_update_member_colour(client):
    create = await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})
    member_id = create.json()["id"]

    response = await client.put(f"/api/v1/members/{member_id}", json={"name": "Danial", "colour": "#16a34a"})
    assert response.status_code == 200
    assert response.json()["colour"] == "#16a34a"


@pytest.mark.asyncio
async def test_update_member_duplicate_name(client):
    await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})
    create2 = await client.post("/api/v1/members", json={"name": "Ali", "colour": "#16a34a"})
    ali_id = create2.json()["id"]

    response = await client.put(f"/api/v1/members/{ali_id}", json={"name": "Danial", "colour": "#16a34a"})
    assert response.status_code == 422
    assert "already exists" in response.json()["error"]


@pytest.mark.asyncio
async def test_update_nonexistent_member(client):
    response = await client.put("/api/v1/members/999", json={"name": "Danial", "colour": "#2563eb"})
    assert response.status_code == 404


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


def make_test_image(fmt="JPEG", size=(100, 100)):
    img = Image.new("RGB", size, color="red")
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    buf.seek(0)
    return buf


@pytest.mark.asyncio
async def test_upload_avatar(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    img = make_test_image()

    response = await client.post(
        f"/api/v1/members/{member['id']}/avatar",
        files={"file": ("photo.jpg", img, "image/jpeg")},
    )
    assert response.status_code == 200
    assert response.json()["avatar_url"] == f"/api/v1/members/{member['id']}/avatar"
    assert avatar_exists(member["id"])


@pytest.mark.asyncio
async def test_serve_avatar(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    img = make_test_image()
    await client.post(f"/api/v1/members/{member['id']}/avatar", files={"file": ("photo.jpg", img, "image/jpeg")})

    response = await client.get(f"/api/v1/members/{member['id']}/avatar")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"


@pytest.mark.asyncio
async def test_serve_avatar_not_found(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    response = await client.get(f"/api/v1/members/{member['id']}/avatar")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_avatar(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    img = make_test_image()
    await client.post(f"/api/v1/members/{member['id']}/avatar", files={"file": ("photo.jpg", img, "image/jpeg")})

    response = await client.delete(f"/api/v1/members/{member['id']}/avatar")
    assert response.status_code == 200
    assert not avatar_exists(member["id"])


@pytest.mark.asyncio
async def test_upload_avatar_invalid_type(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()

    response = await client.post(
        f"/api/v1/members/{member['id']}/avatar",
        files={"file": ("doc.txt", io.BytesIO(b"not an image"), "text/plain")},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_upload_avatar_nonexistent_member(client):
    img = make_test_image()
    response = await client.post("/api/v1/members/999/avatar", files={"file": ("photo.jpg", img, "image/jpeg")})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_member_cascades_avatar(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    img = make_test_image()
    await client.post(f"/api/v1/members/{member['id']}/avatar", files={"file": ("photo.jpg", img, "image/jpeg")})
    assert avatar_exists(member["id"])

    await client.delete(f"/api/v1/members/{member['id']}")
    assert not avatar_exists(member["id"])


@pytest.mark.asyncio
async def test_avatar_url_in_member_response(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    assert member["avatar_url"] is None

    img = make_test_image()
    await client.post(f"/api/v1/members/{member['id']}/avatar", files={"file": ("photo.jpg", img, "image/jpeg")})

    members = (await client.get("/api/v1/members")).json()
    assert members[0]["avatar_url"] == f"/api/v1/members/{member['id']}/avatar"


@pytest.mark.asyncio
async def test_upload_avatar_resizes_large_image(client):
    member = (await client.post("/api/v1/members", json={"name": "Danial", "colour": "#2563eb"})).json()
    img = make_test_image(size=(1000, 800))
    await client.post(f"/api/v1/members/{member['id']}/avatar", files={"file": ("photo.jpg", img, "image/jpeg")})

    response = await client.get(f"/api/v1/members/{member['id']}/avatar")
    saved = Image.open(io.BytesIO(response.content))
    assert saved.size[0] <= 256
    assert saved.size[1] <= 256
