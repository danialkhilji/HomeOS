export interface Member {
  id: number;
  name: string;
  colour: string;
  avatar_url: string | null;
  created_at: string;
}

export interface MemberSummary {
  id: number;
  name: string;
  colour: string;
  avatar_url: string | null;
}

export interface Task {
  id: number;
  title: string;
  assigned_to: number | null;
  is_completed: boolean;
  completed_at: string | null;
  reminder_at: string | null;
  recurrence: string;
  created_at: string;
  member: MemberSummary | null;
}

export interface Store {
  id: number;
  name: string;
  colour: string;
  created_at: string;
}

export interface StoreSummary {
  id: number;
  name: string;
  colour: string;
}

export interface ShoppingItem {
  id: number;
  name: string;
  is_purchased: boolean;
  purchased_at: string | null;
  store_id: number | null;
  created_at: string;
  store: StoreSummary | null;
}

export interface QuickAddItem {
  id: number;
  name: string;
  emoji: string;
  sort_order: number;
}

export interface Note {
  id: number;
  content: string;
  author_id: number | null;
  created_at: string;
  author: MemberSummary | null;
}

export interface Birthday {
  id: number;
  name: string;
  month: number;
  day: number;
  created_at: string;
}

export interface UpcomingBirthday {
  id: number;
  name: string;
  month: number;
  day: number;
  days_until: number;
}

export interface CalendarDateResponse {
  date: string;
  tasks: Task[];
  birthdays: Birthday[];
}

export interface Weather {
  temperature: number;
  condition: string;
  icon: string;
  wind_speed: number;
  feels_like: number;
  rain_chance: number;
  temp_high: number;
  temp_low: number;
  is_day: boolean;
}

export interface PrayerTime {
  name: string;
  time: string;
}

export interface PrayerTimes {
  prayers: PrayerTime[];
  current_prayer: string | null;
  hijri_date: string | null;
}

export type BinIconType = "general" | "garden" | "recycling" | "paper" | "food";

export type BinScheduleType = "weekly" | "week_a" | "week_b";

export interface Bin {
  id: number;
  name: string;
  colour: string;
  icon: BinIconType;
  schedule: BinScheduleType;
  put_out_date: string | null;
  created_at: string;
}

export interface BinSummary {
  id: number;
  name: string;
  colour: string;
  icon: BinIconType;
  schedule: BinScheduleType;
  put_out: boolean;
}

export interface BinSettings {
  collection_weekday: number;
  week_a_date: string;
}

export interface BinCollection {
  date: string;
  days_until: number;
  week_label: "A" | "B";
  bins: BinSummary[];
}

export interface BinScheduleResponse {
  alternating: boolean;
  collections: BinCollection[];
}