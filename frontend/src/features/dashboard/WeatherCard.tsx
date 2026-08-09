import { Card } from "../../components";
import { useWeather } from "../../hooks/useWeather";

const WEATHER_ICONS: Record<string, string> = {
  sunny: "☀️",
  "partly-cloudy": "⛅",
  cloudy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
  stormy: "⛈️",
};

export default function WeatherCard() {
  const { data: weather, isLoading } = useWeather();

  if (isLoading) {
    return (
      <Card title="Weather">
        <p className="text-text-muted dark:text-text-dark-muted">Loading...</p>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card title="Weather">
        <p className="text-text-muted dark:text-text-dark-muted">Weather unavailable</p>
      </Card>
    );
  }

  const icon = WEATHER_ICONS[weather.icon] ?? "🌤️";

  return (
    <Card title="Weather">
      <div className="flex items-center gap-4">
        <span className="text-4xl">{icon}</span>
        <div>
          <p className="text-2xl font-bold">{weather.temperature}°C</p>
          <p className="text-sm text-text-muted dark:text-text-dark-muted">{weather.condition}</p>
        </div>
      </div>
    </Card>
  );
}
