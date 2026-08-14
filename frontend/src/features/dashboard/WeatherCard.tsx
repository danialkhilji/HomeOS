import { useWeather } from "../../hooks/useWeather";
import "./weather-animations.css";

const WEATHER_ICONS: Record<string, string> = {
  sunny: "☀️",
  "partly-cloudy": "⛅",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
  stormy: "⛈️",
  windy: "💨",
};

const WEATHER_CLASSES: Record<string, string> = {
  sunny: "weather-sunny",
  "partly-cloudy": "weather-partly-cloudy",
  cloudy: "weather-cloudy",
  rainy: "weather-rainy",
  snowy: "weather-snowy",
  stormy: "weather-stormy",
  windy: "weather-windy",
};

const LIGHT_BACKGROUNDS = new Set(["snowy"]);

function getEffectiveWeather(icon: string, windSpeed: number): string {
  if (windSpeed >= 40 && !["stormy", "rainy", "snowy"].includes(icon)) {
    return "windy";
  }
  return icon;
}

export default function WeatherCard() {
  const { data: weather, isLoading } = useWeather();

  if (isLoading) {
    return (
      <div className="rounded-2xl p-4 bg-white border border-border shadow-sm">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="rounded-2xl p-4 bg-white border border-border shadow-sm">
        <p className="text-text-muted">Weather unavailable</p>
      </div>
    );
  }

  const effectiveWeather = getEffectiveWeather(weather.icon, weather.wind_speed);
  const bgClass = WEATHER_CLASSES[effectiveWeather] ?? "weather-cloudy";
  const icon = WEATHER_ICONS[effectiveWeather] ?? "🌤️";
  const isLight = LIGHT_BACKGROUNDS.has(effectiveWeather);

  const textColor = isLight ? "text-text" : "text-white";
  const subtextColor = isLight ? "text-text-muted" : "text-white/70";

  return (
    <div className={`rounded-2xl p-4 shadow-sm ${bgClass}`}>
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-3xl sm:text-4xl mb-1">{icon}</span>
        <p className={`text-3xl sm:text-4xl font-bold ${textColor}`}>
          {weather.temperature}°C
        </p>
        <p className={`text-xs sm:text-sm ${subtextColor}`}>
          {weather.condition}
        </p>

        <div className={`flex items-center gap-3 mt-2 text-xs sm:text-sm ${subtextColor}`}>
          <span>Feels {weather.feels_like}°</span>
          <span>🌧 {weather.rain_chance}%</span>
        </div>

        <div className={`flex items-center gap-3 mt-1 text-xs sm:text-sm ${subtextColor}`}>
          <span>↑ {weather.temp_high}°</span>
          <span>↓ {weather.temp_low}°</span>
        </div>
      </div>
    </div>
  );
}