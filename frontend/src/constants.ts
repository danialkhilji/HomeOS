import type { BinIconType, BinScheduleType } from "./types";

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

const BIN_GREY = "#4B5563";
const BIN_BLACK = "#1F2937";
const BIN_GREEN = "#3F9142";
const BIN_BROWN = "#8B5A2B";
const BIN_BLUE = "#2F6FD6";
const BIN_YELLOW = "#E6B422";
const BIN_PURPLE = "#7C5CC4";

export const BIN_COLOURS = [BIN_GREY, BIN_BLACK, BIN_GREEN, BIN_BROWN, BIN_BLUE, BIN_YELLOW, BIN_PURPLE];

export interface BinTypeOption {
  icon: BinIconType;
  label: string;
  defaultName: string;
  defaultColour: string;
}

export const BIN_TYPES: BinTypeOption[] = [
  { icon: "general", label: "General", defaultName: "General waste", defaultColour: BIN_GREY },
  { icon: "garden", label: "Garden", defaultName: "Garden waste", defaultColour: BIN_GREEN },
  { icon: "food", label: "Food", defaultName: "Food waste", defaultColour: BIN_BROWN },
  { icon: "cardboard", label: "Cardboard", defaultName: "Cardboard", defaultColour: BIN_BLUE },
  { icon: "plastic", label: "Plastic", defaultName: "Plastic", defaultColour: BIN_YELLOW },
  { icon: "glass", label: "Glass", defaultName: "Glass", defaultColour: BIN_PURPLE },
];

export const BIN_SCHEDULE_LABELS: Record<BinScheduleType, string> = {
  weekly: "Every week",
  week_a: "Week A",
  week_b: "Week B",
};
