from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)) -> dict:
    db_status = "connected"
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        logger.exception("Database health check failed")
        db_status = "disconnected"

    return {
        "app": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
    }
