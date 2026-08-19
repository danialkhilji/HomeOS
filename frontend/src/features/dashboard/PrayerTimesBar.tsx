import { Card, LoadingSpinner } from "../../components";
import { usePrayerTimes } from "../../hooks/usePrayerTimes";

export default function PrayerTimesBar() {
  const { data, isLoading } = usePrayerTimes();

  if (isLoading) {
    return (
      <Card>
        <LoadingSpinner />
      </Card>
    );
  }

  if (!data || data.prayers.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="grid grid-cols-5">
        {data.prayers.map((prayer) => {
          const isCurrent = data.current_prayer === prayer.name;
          return (
            <div
              key={prayer.name}
              className={`flex flex-col items-center gap-1 px-1 py-1 rounded-xl transition-colors ${
                isCurrent
                  ? "bg-primary/10"
                  : ""
              }`}
            >
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isCurrent
                    ? "text-primary"
                    : "text-text-muted"
                }`}
              >
                {prayer.name}
              </span>
              <span
                className={`text-base font-bold whitespace-nowrap ${
                  isCurrent
                    ? "text-primary"
                    : "text-text"
                }`}
              >
                {prayer.time}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}