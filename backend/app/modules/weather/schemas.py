from pydantic import BaseModel


class WeatherResponse(BaseModel):
    temperature: float
    condition: str
    icon: str
    wind_speed: float = 0
    feels_like: float = 0
    rain_chance: int = 0
    temp_high: float = 0
    temp_low: float = 0