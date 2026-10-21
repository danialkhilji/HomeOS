import type { BinIconType } from "./types";

export const INPUT_STYLE =
  "w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary";

export const TAP_SPRING = { type: "spring" as const, stiffness: 400, damping: 20 };

export const PRESET_COLOURS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f97316",
  "#8b5cf6",
  "#0891b2",
  "#db2777",
  "#ca8a04",
];

const BIN_DARK_GREY = "#374151";
const BIN_BROWN = "#8B5A2B";
const BIN_YELLOW = "#E6B422";
const BIN_RED = "#C8372D";
const BIN_LIGHT_GREY = "#BFC4CA";

export const BIN_COLOURS = [BIN_DARK_GREY, BIN_BROWN, BIN_YELLOW, BIN_RED, BIN_LIGHT_GREY];

export interface BinTypeOption {
  icon: BinIconType;
  name: string;
  colour: string;
}

export const BIN_TYPES: BinTypeOption[] = [
  { icon: "general", name: "General waste", colour: BIN_DARK_GREY },
  { icon: "garden", name: "Garden waste", colour: BIN_BROWN },
  { icon: "recycling", name: "Glass/cans/plastics", colour: BIN_YELLOW },
  { icon: "paper", name: "Paper/card", colour: BIN_RED },
  { icon: "food", name: "Food waste", colour: BIN_LIGHT_GREY },
];

// Bins are stored as Week A / Week B; the UI shows them relative to the upcoming collection
export type BinWeek = "weekly" | "this_week" | "next_week";

export const BIN_WEEK_LABELS: Record<BinWeek, string> = {
  weekly: "Every week",
  this_week: "This week",
  next_week: "Next week",
};
