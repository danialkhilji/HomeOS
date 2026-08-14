import { useState, useMemo } from "react";
import { Card } from "../../components";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

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
