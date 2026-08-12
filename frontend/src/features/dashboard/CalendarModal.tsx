import { useState, useMemo, useRef, useCallback } from "react";
import { Modal, Button } from "../../components";

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

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CalendarModal({ open, onClose }: CalendarModalProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const touchStartY = useRef(0);

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

  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function goToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]!.clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = e.changedTouches[0]!.clientY - touchStartY.current;
    if (diff > 50) {
      prevMonth();
    } else if (diff < -50) {
      nextMonth();
    }
  }, [viewMonth, viewYear]);

  return (
    <Modal open={open} onClose={onClose} title="Calendar">
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-text-muted dark:text-text-dark-muted active:bg-surface-dim dark:active:bg-surface-dark-dim"
          >
            <ChevronLeft />
          </button>

          <span className="text-lg font-bold text-text dark:text-text-dark">
            {MONTHS[viewMonth]} {viewYear}
          </span>

          <button
            onClick={nextMonth}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-text-muted dark:text-text-dark-muted active:bg-surface-dim dark:active:bg-surface-dark-dim"
          >
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS.map((d) => (
            <div key={d} className="text-sm font-semibold text-text-muted dark:text-text-dark-muted py-1">
              {d}
            </div>
          ))}

          {grid.map((day, i) => (
            <div
              key={i}
              className={`text-base py-2 rounded-full ${
                isToday(day)
                  ? "bg-primary text-white font-bold"
                  : day !== null
                    ? "text-text dark:text-text-dark"
                    : ""
              }`}
            >
              {day ?? ""}
            </div>
          ))}
        </div>

        {!isCurrentMonth && (
          <div className="mt-4">
            <Button fullWidth variant="secondary" onClick={goToday}>
              Today
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
