import { useState, useMemo } from "react";
import { Card } from "../../components";
import { DAYS, MONTHS, getDaysInMonth, getFirstDayOfMonth } from "./calendarUtils";

export default function CalendarWidget({ onExpand }: { onExpand?: () => void }) {
  const today = new Date();
  const [viewYear] = useState(today.getFullYear());
  const [viewMonth] = useState(today.getMonth());

  const grid = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }

    return cells;
  }, [viewYear, viewMonth]);

  const isToday = (day: number | null) => {
    if (day === null) return false;
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  return (
    <Card onClick={onExpand}>
      <div className="text-center text-sm font-semibold mb-2 text-text">
        {MONTHS[viewMonth]} {viewYear}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {DAYS.map((d) => (
          <div key={d} className="text-xs font-medium text-text-muted py-0.5">
            {d}
          </div>
        ))}

        {grid.map((day, i) => (
          <div
            key={i}
            className={`text-xs py-1 rounded-full ${
              isToday(day)
                ? "bg-primary text-white font-bold"
                : day !== null
                  ? "text-text"
                  : ""
            }`}
          >
            {day ?? ""}
          </div>
        ))}
      </div>
    </Card>
  );
}
