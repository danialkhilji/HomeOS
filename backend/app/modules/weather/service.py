import time

import httpx

from app.core.config import settings
from app.core.logging import get_logger
from app.modules.weather.schemas import WeatherResponse

logger = get_logger(__name__)

WEATHER_CODES = {
    0: ("Clear", "sunny"),
    1: ("Mostly Clear", "sunny"),
    2: ("Partly Cloudy", "partly-cloudy"),
    3: ("Overcast", "cloudy"),
    45: ("Foggy", "cloudy"),
    48: ("Freezing Fog", "cloudy"),
    51: ("Light Drizzle", "rainy"),
    53: ("Drizzle", "rainy"),
    55: ("Heavy Drizzle", "rainy"),
    56: ("Freezing Drizzle", "rainy"),
    57: ("Heavy Freezing Drizzle", "rainy"),
    61: ("Light Rain", "rainy"),
    63: ("Rain", "rainy"),
    65: ("Heavy Rain", "rainy"),
    66: ("Freezing Rain", "rainy"),
    67: ("Heavy Freezing Rain", "rainy"),
    71: ("Light Snow", "snowy"),
    73: ("Snow", "snowy"),
    75: ("Heavy Snow", "snowy"),
    77: ("Snow Grains", "snowy"),
    80: ("Light Showers", "rainy"),
    81: ("Showers", "rainy"),
    82: ("Heavy Showers", "rainy"),
    85: ("Light Snow Showers", "snowy"),
    86: ("Heavy Snow Showers", "snowy"),
    95: ("Thunderstorm", "stormy"),
    96: ("Thunderstorm with Hail", "stormy"),
    99: ("Thunderstorm with Heavy Hail", "stormy"),
}

_cache: dict[str, WeatherResponse | float] = {}


def _is_cache_valid() -> bool:
    cached_at = _cache.get("cached_at")
    if cached_at is None:
        return False
    return (time.monotonic() - cached_at) < (settings.WEATHER_CACHE_MINUTES * 60)  # type: ignore[operator]


async def get_weather() -> WeatherResponse:
    if _is_cache_valid() and "data" in _cache:
        return _cache["data"]  # type: ignore[return-value]

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": settings.WEATHER_LATITUDE,
        "longitude": settings.WEATHER_LONGITUDE,
        "current": "temperature_2m,apparent_temperature,weather_code,wind_speed_10m",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        "timezone": "auto",
        "forecast_days": 1,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

        current = data["current"]
        code = current.get("weather_code", 0)
        condition, icon = WEATHER_CODES.get(code, ("Unknown", "cloudy"))

        daily = data.get("daily", {})

        result = WeatherResponse(
            temperature=round(current["temperature_2m"], 1),
            condition=condition,
            icon=icon,
            wind_speed=round(current.get("wind_speed_10m", 0), 1),
            feels_like=round(current.get("apparent_temperature", 0), 1),
            rain_chance=daily.get("precipitation_probability_max", [0])[0],
            temp_high=round(daily.get("temperature_2m_max", [0])[0], 1),
            temp_low=round(daily.get("temperature_2m_min", [0])[0], 1),
        )

        _cache["data"] = result
        _cache["cached_at"] = time.monotonic()
        logger.info("Weather fetched: %.1f°C, %s", result.temperature, result.condition)
        return result

    except Exception:
        logger.exception("Failed to fetch weather")
        if "data" in _cache:
            return _cache["data"]  # type: ignore[return-value]
        return WeatherResponse(temperature=0, condition="Unavailable", icon="cloudy")
