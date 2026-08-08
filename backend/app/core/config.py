from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    APP_NAME: str = "HomeOS"
    DEBUG: bool = True
    VERSION: str = "0.1.0"

    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR / 'homeos.db'}"

    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    API_V1_PREFIX: str = "/api/v1"

    WEATHER_LATITUDE: float = 51.5074
    WEATHER_LONGITUDE: float = -0.1278
    WEATHER_CACHE_MINUTES: int = 30


settings = Settings()
