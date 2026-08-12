import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components";

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

interface CalendarModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CalendarModal({ open, onClose }: CalendarModalProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const touchStartY = useRef(0);

  const yearOptions = Array.from({ length: 201 }, (_, i) => 1900 + i);

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
    setDirection(-1);
    setSelectedDay(null);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    setDirection(1);
    setSelectedDay(null);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  }

  function goToday() {
    setDirection(0);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    touchStartY.current = e.touches[0]!.clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    const diff = e.changedTouches[0]!.clientY - touchStartY.current;
    if (diff > 50) {
      prevMonth();
    } else if (diff < -50) {
      nextMonth();
    }
  }, [viewMonth, viewYear]);

  const slideVariants = {
    enter: (dir: number) => ({
      y: dir > 0 ? 80 : dir < 0 ? -80 : 0,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      y: dir > 0 ? -80 : dir < 0 ? 80 : 0,
      opacity: 0,
    }),
  };

  const selectStyle = "min-h-[48px] px-3 rounded-xl border border-border bg-surface text-text text-base font-semibold dark:border-border-dark dark:bg-surface-dark-dim dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-center";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div
              className="w-full max-w-lg rounded-2xl px-6 py-4 bg-white dark:bg-surface-dark shadow-xl pointer-events-auto overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <select
                  value={viewMonth}
                  onChange={(e) => {
                    setDirection(0);
                    setSelectedDay(null);
                    setViewMonth(Number(e.target.value));
                  }}
                  className={selectStyle}
                >
                  {MONTHS.map((name, i) => (
                    <option key={name} value={i}>{name}</option>
                  ))}
                </select>

                <select
                  value={viewYear}
                  onChange={(e) => {
                    setDirection(0);
                    setSelectedDay(null);
                    setViewYear(Number(e.target.value));
                  }}
                  className={selectStyle}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {DAYS.map((d) => (
                  <div key={d} className="text-sm font-semibold text-text-muted dark:text-text-dark-muted py-1">
                    {d}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${viewYear}-${viewMonth}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-7 gap-1 text-center"
                >
                  {grid.map((day, i) => {
                    const todayMatch = isToday(day);
                    const selected = day !== null && day === selectedDay && !todayMatch;

                    return (
                      <div
                        key={i}
                        onClick={() => { if (day !== null) setSelectedDay(day); }}
                        className={`text-base py-2 rounded-full cursor-pointer ${
                          selected
                            ? "bg-primary/20 text-primary font-bold ring-2 ring-primary"
                            : todayMatch
                              ? "bg-primary text-white font-bold"
                              : day !== null
                                ? "text-text dark:text-text-dark active:bg-surface-dim dark:active:bg-surface-dark-dim"
                                : ""
                        }`}
                      >
                        {day ?? ""}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {!isCurrentMonth && (
                <div className="mt-4">
                  <Button fullWidth variant="secondary" onClick={goToday}>
                    Today
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
