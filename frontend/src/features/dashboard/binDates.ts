import type { BinWeek } from "../../constants";
import type { BinScheduleType, BinSettings } from "../../types";

// Dates are local calendar days as "YYYY-MM-DD". new Date("YYYY-MM-DD") and toISOString() both use UTC and shift the day during BST.

const DAY_MS = 24 * 60 * 60 * 1000;

function dateParts(value: string): [number, number, number] {
  const [y = 1970, m = 1, d = 1] = value.split("-").map(Number);
  return [y, m, d];
}

export function parseLocalDate(value: string): Date {
  const [y, m, d] = dateParts(value);
  return new Date(y, m - 1, d);
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = dateParts(from);
  const [ty, tm, td] = dateParts(to);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / DAY_MS);
}

function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function nextCollectionDate(weekday: number, today: Date = new Date()): Date {
  return addDays(today, (weekday - mondayIndex(today) + 7) % 7);
}

// Matches the backend: Week A when the number of calendar weeks since week_a_date is even.
export function weekLabel(date: Date, weekADate: Date): "A" | "B" {
  const mondayOfDate = toDateKey(addDays(date, -mondayIndex(date)));
  const mondayOfWeekA = toDateKey(addDays(weekADate, -mondayIndex(weekADate)));
  const weeks = daysBetween(mondayOfWeekA, mondayOfDate) / 7;
  return Math.abs(weeks) % 2 === 0 ? "A" : "B";
}

// Week label of the next collection day. With no settings yet, the first collection day picked becomes Week A
export function upcomingWeekLabel(settings: BinSettings | null | undefined, today: Date = new Date()): "A" | "B" {
  if (!settings) return "A";
  return weekLabel(nextCollectionDate(settings.collection_weekday, today), parseLocalDate(settings.week_a_date));
}

export function toBinWeek(schedule: BinScheduleType, upcoming: "A" | "B"): BinWeek {
  if (schedule === "weekly") return "weekly";
  return (schedule === "week_a") === (upcoming === "A") ? "this_week" : "next_week";
}

export function toBinSchedule(week: BinWeek, upcoming: "A" | "B"): BinScheduleType {
  if (week === "weekly") return "weekly";
  return (week === "this_week") === (upcoming === "A") ? "week_a" : "week_b";
}

export function formatShortDate(value: string): string {
  return parseLocalDate(value).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function formatLongDate(value: string): string {
  return parseLocalDate(value).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

export function formatRelativeDays(daysUntil: number): string {
  if (daysUntil === 0) return "Today";
  if (daysUntil === 1) return "Tomorrow";
  return `in ${daysUntil} days`;
}
