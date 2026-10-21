import { useState } from "react";
import { motion } from "framer-motion";
import {
  BinIcon,
  CalendarIcon,
  Card,
  ChevronRightIcon,
  WheelieBinIcon,
} from "../../components";
import { TAP_SPRING } from "../../constants";
import { useBinSchedule, useToggleBinPutOut } from "../../hooks/useBins";
import BinScheduleModal from "./BinScheduleModal";
import { daysBetween, formatLongDate, formatShortDate } from "./binDates";

// Static class names so Tailwind can see them. 4 bins sit in a 2x2 grid, 5+ wrap in rows of 3
const TILE_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2",
};

export default function BinCollectionCard() {
  const { data } = useBinSchedule(6);
  const togglePutOut = useToggleBinPutOut();
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const next = data?.collections[0];
  if (!data || !next) return null;

  const { alternating, collections } = data;
  const following = collections[1];
  const weekBin = next.bins.find((bin) => bin.schedule !== "weekly");

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
              <p className="text-sm font-medium text-primary">
                {formatLongDate(next.date)}
              </p>
            </div>
          </div>

          {alternating && next.days_until < 7 && (
            <div className="ml-auto flex flex-row-reverse items-center gap-2 sm:flex-col sm:items-end sm:gap-1 text-right">
              <span className="px-3 py-1 rounded-full bg-accent-pale text-primary-dark text-sm font-semibold">
                This week
              </span>
              {weekBin && (
                <span className="text-xs text-text-muted">({weekBin.name} week)</span>
              )}
            </div>
          )}
        </div>

        <div className={`grid grid-cols-1 gap-3 ${TILE_COLS[next.bins.length] ?? "sm:grid-cols-3"}`}>
          {next.bins.map((bin) => (
            // Tap once the bin is outside; it greys out for everyone until that collection has passed
            <motion.button
              key={bin.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              transition={TAP_SPRING}
              onClick={() => togglePutOut.mutate(bin.id)}
              aria-pressed={bin.put_out}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                bin.put_out ? "bg-text-faint/15 border-text-faint/30" : ""
              }`}
              style={bin.put_out ? undefined : { backgroundColor: `${bin.colour}14`, borderColor: `${bin.colour}33` }}
            >
              <div className={`shrink-0 transition ${bin.put_out ? "grayscale opacity-50" : ""}`}>
                <BinIcon icon={bin.icon} colour={bin.colour} size={56} />
              </div>
              <p className={`min-w-0 text-xs font-semibold uppercase tracking-wide ${bin.put_out ? "text-text-faint" : "text-text-muted"}`}>
                {bin.name}
              </p>
            </motion.button>
          ))}
        </div>

        {following && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={TAP_SPRING}
            onClick={() => setScheduleOpen(true)}
            className="mt-3 w-full min-h-[44px] flex items-center gap-2.5 rounded-xl border border-border bg-surface-dim px-3 py-1.5 text-left"
          >
            <CalendarIcon size={18} className="text-primary shrink-0" />
            <p className="flex-1 min-w-0 truncate text-sm text-text-muted">
              <span className="font-semibold text-text">
                {daysBetween(next.date, following.date) === 7
                  ? "Next week"
                  : formatShortDate(following.date)}
              </span>
              <span className="hidden sm:inline"> · {following.bins.map((bin) => bin.name).join(" · ")}</span>
            </p>
            <div className="flex items-center gap-1 shrink-0">
              {following.bins.map((bin) => (
                <BinIcon key={bin.id} icon={bin.icon} colour={bin.colour} size={24} />
              ))}
            </div>
            <ChevronRightIcon size={18} className="text-text-faint shrink-0" />
          </motion.button>
        )}
      </Card>

      <BinScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        collections={collections}
      />
    </div>
  );
}
