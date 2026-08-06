from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.logging import get_logger

logger = get_logger(__name__)


class HomeOSException(Exception):
    def __init__(self, message: str = "An unexpected error occurred", status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundError(HomeOSException):
    def __init__(self, resource: str, resource_id: str | int):
        super().__init__(
            message=f"{resource} with id '{resource_id}' not found",
            status_code=404,
        )


class ValidationError(HomeOSException):
    def __init__(self, message: str = "Validation failed"):
        super().__init__(message=message, status_code=422)


async def homeos_exception_handler(request: Request, exc: HomeOSException) -> JSONResponse:
    logger.warning("HomeOS error: %s (status=%d)", exc.message, exc.status_code)
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message},
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"error": "An unexpected error occurred"},
    )
