from pydantic import BaseModel


class WeatherResponse(BaseModel):
    temperature: float
    condition: str
    icon: str
    wind_speed: float = 0