import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, LoadingSpinner, IconButton } from "../../components";
import { useCalendarDate } from "../../hooks/useCalendar";
import { useCreateBirthday, useDeleteBirthday } from "../../hooks/useBirthdays";
import AddBirthdayModal from "./AddBirthdayModal";

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

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
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
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [direction, setDirection] = useState(0);
  const touchStartY = useRef(0);

  const yearOptions = Array.from({ length: 201 }, (_, i) => 1900 + i);

  const isViewingSelectedMonth = viewMonth === selectedMonth && viewYear === selectedYear;
  const activeDay = isViewingSelectedMonth ? selectedDay : null;

  const selectedDateStr = selectedDay !== null
    ? `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`
    : null;

  const { data: calendarData, isLoading: calendarLoading } = useCalendarDate(selectedDateStr);
  const dateTasks = calendarData?.tasks ?? [];
  const dateBirthdays = calendarData?.birthdays ?? [];
  const createBirthday = useCreateBirthday();
  const deleteBirthday = useDeleteBirthday();
  const [birthdayModalOpen, setBirthdayModalOpen] = useState(false);

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



  function prevMonth() {
    setDirection(-1);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  }

  function nextMonth() {
    setDirection(1);
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
    setSelectedDay(today.getDate());
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  }

  function handleAddBirthday(name: string) {
    if (selectedDay === null) return;
    createBirthday.mutate(
      { name, month: selectedMonth + 1, day: selectedDay },
      { onSuccess: () => setBirthdayModalOpen(false) },
    );
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setViewYear(today.getFullYear());
      setViewMonth(today.getMonth());
      setSelectedDay(today.getDate());
      setSelectedMonth(today.getMonth());
      setSelectedYear(today.getFullYear());
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

  function formatSelectedDate() {
    if (selectedDay === null) return "";
    return `${selectedDay} ${MONTHS[viewMonth]?.slice(0, 3)}`;
  }

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
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-surface-dark shadow-xl pointer-events-auto overflow-hidden max-h-[85dvh] flex flex-col"
            >
              <div className="shrink-0 px-6 pt-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <select
                  value={viewMonth}
                  onChange={(e) => {
                    setDirection(0);
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
                    setViewYear(Number(e.target.value));
                  }}
                  className={selectStyle}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
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
                      const selected = day !== null && day === activeDay && !todayMatch;

                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (day !== null) {
                              setSelectedDay(day);
                              setSelectedMonth(viewMonth);
                              setSelectedYear(viewYear);
                            }
                          }}
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
              </div>
              </div>

              {selectedDay !== null && isViewingSelectedMonth && (
                <div className="flex-1 overflow-y-auto px-6">
                <div className="pt-3 border-t border-border dark:border-border-dark">
                  <h3 className="text-sm font-semibold text-text-muted dark:text-text-dark-muted mb-2">
                    Tasks for {formatSelectedDate()}
                  </h3>
                  {calendarLoading ? (
                    <LoadingSpinner size={20} />
                  ) : dateTasks.length === 0 ? (
                    <p className="text-sm text-text-muted dark:text-text-dark-muted py-2">
                      No tasks for this date.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {dateTasks.map((task) => (
                        <div key={task.id} className="py-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${
                              task.is_completed
                                ? "line-through text-text-muted dark:text-text-dark-muted"
                                : "text-text dark:text-text-dark"
                            }`}>
                              {task.member && (
                                <>
                                  <span className="font-semibold">{task.member.name}</span>
                                  <span className="text-text-muted dark:text-text-dark-muted"> — </span>
                                </>
                              )}
                              {task.title}
                            </span>
                          </div>
                          {(task.reminder_at || task.recurrence !== "none") && (
                            <div className="flex items-center gap-2 mt-0.5">
                              {task.reminder_at && (
                                <span className="text-xs text-text-muted dark:text-text-dark-muted">
                                  🔔 {new Date(task.reminder_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                              {task.recurrence !== "none" && (
                                <span className="text-xs text-text-muted dark:text-text-dark-muted">
                                  🔁 {task.recurrence}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {dateBirthdays.length > 0 && (
                    <>
                      <h3 className="text-sm font-semibold text-text-muted dark:text-text-dark-muted mt-4 mb-2">
                        🎂 Birthdays
                      </h3>
                      <div className="space-y-1">
                        {dateBirthdays.map((bday) => (
                          <div key={bday.id} className="flex items-center justify-between py-1">
                            <span className="text-sm text-text dark:text-text-dark">{bday.name}</span>
                            <IconButton
                              icon={<TrashIcon />}
                              variant="danger"
                              label={`Delete ${bday.name}`}
                              onClick={() => deleteBirthday.mutate(bday.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                </div>
              )}

              <div className="flex gap-3 px-6 py-3 shrink-0 border-t border-border dark:border-border-dark">
                <Button fullWidth onClick={() => setBirthdayModalOpen(true)}>
                  Add Birthday
                </Button>
                <Button fullWidth variant="secondary" onClick={goToday}>
                  Today
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      <AddBirthdayModal
        open={birthdayModalOpen}
        onClose={() => setBirthdayModalOpen(false)}
        onSave={handleAddBirthday}
        dateLabel={formatSelectedDate()}
      />
    </AnimatePresence>
  );
}
