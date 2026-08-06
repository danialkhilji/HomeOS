from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import v1_router
from app.core.config import settings
from app.core.database import engine
from app.core.exceptions import (
    HomeOSException,
    homeos_exception_handler,
    unhandled_exception_handler,
)
from app.core.logging import get_logger, setup_logging

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    setup_logging()
    logger.info("Starting %s v%s", settings.APP_NAME, settings.VERSION)
    yield
    await engine.dispose()
    logger.info("%s shutdown complete", settings.APP_NAME)


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(HomeOSException, homeos_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.include_router(v1_router, prefix=settings.API_V1_PREFIX)
