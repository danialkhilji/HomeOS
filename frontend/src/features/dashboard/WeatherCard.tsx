import { Card } from "../../components";

export default function WeatherCard() {
  return (
    <Card title="Weather">
      <div className="flex items-center gap-4">
        <span className="text-4xl">☀️</span>
        <div>
          <p className="text-2xl font-bold">21°C</p>
          <p className="text-sm text-text-muted dark:text-text-dark-muted">Sunny</p>
        </div>
      </div>
    </Card>
  );
}
