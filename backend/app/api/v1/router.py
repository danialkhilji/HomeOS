from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.modules.members.router import router as members_router
from app.modules.tasks.router import router as tasks_router
from app.modules.shopping.router import router as shopping_router
from app.modules.notes.router import router as notes_router
from app.modules.weather.router import router as weather_router
from app.modules.prayer.router import router as prayer_router
from app.modules.shopping.store_router import router as store_router
from app.modules.shopping.quick_add_router import router as quick_add_router
from app.modules.birthdays.router import router as birthdays_router

v1_router = APIRouter()
v1_router.include_router(health_router)
v1_router.include_router(members_router)
v1_router.include_router(tasks_router)
v1_router.include_router(shopping_router)
v1_router.include_router(store_router)
v1_router.include_router(quick_add_router)
v1_router.include_router(notes_router)
v1_router.include_router(weather_router)
v1_router.include_router(prayer_router)
v1_router.include_router(birthdays_router)
