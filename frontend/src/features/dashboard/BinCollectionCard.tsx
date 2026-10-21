import { useState } from "react";
import { motion } from "framer-motion";
import {
  BinIcon,
  CalendarIcon,
  Card,
  CheckCircleFilledIcon,
  ChevronRightIcon,
  WheelieBinIcon,
} from "../../components";
import { TAP_SPRING } from "../../constants";
import { useBinSchedule } from "../../hooks/useBins";
import BinScheduleModal from "./BinScheduleModal";
import { daysBetween, formatLongDate, formatShortDate, formatWeekday } from "./binDates";

// Static class names so Tailwind can see them. 4 bins sit in a 2x2 grid, 5+ wrap in rows of 3
const TILE_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2",
};

function nextCollectionLabel(daysUntil: number, date: string) {
  if (daysUntil === 0) return "Today";
  if (daysUntil === 1) return "Tomorrow";
  return daysUntil < 7 ? formatWeekday(date) : formatLongDate(date);
}

function statusLabel(daysUntil: number, date: string) {
  if (daysUntil === 0) return "Collection today";
  if (daysUntil === 1) return "Put out tonight";
  return formatShortDate(date);
}

function shortName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

export default function BinCollectionCard() {
  const { data } = useBinSchedule(6);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const next = data?.collections[0];
  if (!data || !next) return null;

  const { alternating, collections } = data;
  const following = collections[1];
  const weekBin = next.bins.find((bin) => bin.schedule !== "weekly");
  const showTick = next.days_until <= 1;
  const status = statusLabel(next.days_until, next.date);

  return (
    <div>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-accent-pale text-primary flex items-center justify-center shrink-0">
              <WheelieBinIcon size={26} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-text leading-tight">
                Bin Collection
              </h3>
              <p className="text-sm text-text-muted">
                Next collection ·{" "}
                <span className="font-medium text-primary">
                  {nextCollectionLabel(next.days_until, next.date)}
                </span>
              </p>
            </div>
          </div>

          {alternating && (
            <div className="ml-auto flex flex-row-reverse items-center gap-2 sm:flex-col sm:items-end sm:gap-1 text-right">
              <span className="px-3 py-1 rounded-full bg-accent-pale text-primary-dark text-sm font-semibold">
                Week {next.week_label}
              </span>
              {weekBin && (
                <span className="text-xs text-text-muted">({weekBin.name} week)</span>
              )}
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 gap-3 ${TILE_COLS[next.bins.length] ?? "sm:grid-cols-3"}`}>
          {next.bins.map((bin) => (
            <div
              key={bin.id}
              className="flex items-center gap-3 rounded-xl border p-3"
              style={{ backgroundColor: `${bin.colour}14`, borderColor: `${bin.colour}33` }}
            >
              <BinIcon icon={bin.icon} colour={bin.colour} size={56} />
              <div className="min-w-0">
                <p className="text-base font-semibold text-text leading-tight">{bin.name}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
                  {showTick && (
                    <CheckCircleFilledIcon size={16} className="text-primary shrink-0" />
                  )}
                  {status}
                </p>
              </div>
            </div>
          ))}
        </div>

        {following && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={TAP_SPRING}
            onClick={() => setScheduleOpen(true)}
            className="mt-3 w-full min-h-[56px] flex items-center gap-3 rounded-xl border border-border bg-surface-dim px-3 py-2.5 text-left"
          >
            <CalendarIcon size={24} className="text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-base text-text">
                <span className="font-semibold">
                  {daysBetween(next.date, following.date) === 7
                    ? "Next week"
                    : formatShortDate(following.date)}
                </span>
                {alternating && (
                  <span className="text-text-muted"> (Week {following.week_label})</span>
                )}
              </p>
              <p className="text-sm text-text-muted sm:truncate">
                {following.bins.map((bin) => bin.name).join(" · ")}
              </p>
            </div>
            <div className="hidden sm:flex items-end divide-x divide-border shrink-0">
              {following.bins.map((bin) => (
                <div key={bin.id} className="flex flex-col items-center gap-0.5 min-w-16 max-w-28 px-2">
                  <BinIcon icon={bin.icon} colour={bin.colour} size={32} />
                  <span className="text-xs text-text-muted truncate max-w-full">
                    {shortName(bin.name)}
                  </span>
                </div>
              ))}
            </div>
            <ChevronRightIcon size={20} className="text-text-faint shrink-0" />
          </motion.button>
        )}
      </Card>

      <BinScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        collections={collections}
        alternating={alternating}
      />
    </div>
  );
}
