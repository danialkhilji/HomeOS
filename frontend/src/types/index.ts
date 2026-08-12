export interface Member {
  id: number;
  name: string;
  colour: string;
  created_at: string;
}

export interface MemberSummary {
  id: number;
  name: string;
  colour: string;
}

export interface Task {
  id: number;
  title: string;
  assigned_to: number | null;
  is_completed: boolean;
  completed_at: string | null;
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

export interface Weather {
  temperature: number;
  condition: string;
  icon: string;
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

export interface HealthResponse {
  app: string;
  version: string;
  status: string;
  database: string;
}
