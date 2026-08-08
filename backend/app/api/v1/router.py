from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.modules.members.router import router as members_router
from app.modules.tasks.router import router as tasks_router
from app.modules.shopping.router import router as shopping_router

v1_router = APIRouter()
v1_router.include_router(health_router)
v1_router.include_router(members_router)
v1_router.include_router(tasks_router)
v1_router.include_router(shopping_router)
