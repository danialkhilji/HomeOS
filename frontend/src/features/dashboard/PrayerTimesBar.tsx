import { Card, LoadingSpinner } from "../../components";
import { usePrayerTimes } from "../../hooks/usePrayerTimes";

const S = 22;

const SUN = "#D99035";
const MOON = "#3D2E22";
const MOON_STROKE = "#3D2E22";

function FajrIcon() {
  return (
    <svg width={S} height={S} viewBox="2 4 20 20" fill="none">
      <path d="M15.5 8.5a6.5 6.5 0 1 1-9.19 9.19A8 8 0 0 0 15.5 8.5z" fill={MOON} stroke={MOON_STROKE} strokeWidth={1} />
    </svg>
  );
}

function DhuhrIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" fill={SUN} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 12 + 7.5 * Math.cos(rad);
        const y1 = 12 + 7.5 * Math.sin(rad);
        const x2 = 12 + 9.5 * Math.cos(rad);
        const y2 = 12 + 9.5 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SUN} strokeWidth={2} strokeLinecap="round" />;
      })}
    </svg>
  );
}

function AsrIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="4.5" fill={SUN} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 12 + 7 * Math.cos(rad);
        const y1 = 10 + 7 * Math.sin(rad);
        const x2 = 12 + 8.5 * Math.cos(rad);
        const y2 = 10 + 8.5 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={SUN} strokeWidth={1.8} strokeLinecap="round" />;
      })}
      <line x1="3" y1="21" x2="21" y2="21" stroke={SUN} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function MaghribIcon() {
  return (
    <svg width={S} height={S} viewBox="0 0 24 24" fill="none">
      <path d="M4 17a8 8 0 0 1 16 0" fill={SUN} opacity={0.6} />
      <path d="M7 17a5 5 0 0 1 10 0" fill={SUN} />
      <line x1="3" y1="17" x2="21" y2="17" stroke={SUN} strokeWidth={2} strokeLinecap="round" />
      <line x1="12" y1="3" x2="12" y2="5.5" stroke={SUN} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="5.5" y1="7" x2="7.2" y2="8.7" stroke={SUN} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="18.5" y1="7" x2="16.8" y2="8.7" stroke={SUN} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

function IshaIcon() {
  return (
    <svg width={S} height={S} viewBox="2 4 20 20" fill="none">
      <path d="M15.5 8.5a6.5 6.5 0 1 1-9.19 9.19A8 8 0 0 0 15.5 8.5z" fill={MOON} stroke={MOON_STROKE} strokeWidth={1} />
    </svg>
  );
}

const PRAYER_ICONS: Record<string, React.FC> = {
  Fajr: FajrIcon,
  Dhuhr: DhuhrIcon,
  Asr: AsrIcon,
  Maghrib: MaghribIcon,
  Isha: IshaIcon,
};

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
              {PRAYER_ICONS[prayer.name] && (() => {
                const Icon = PRAYER_ICONS[prayer.name]!;
                return <Icon />;
              })()}
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