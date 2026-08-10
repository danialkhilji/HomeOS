import apiClient from "./client";
import type { PrayerTimes } from "../types";

export async function fetchPrayerTimes(): Promise<PrayerTimes> {
  const response = await apiClient.get<PrayerTimes>("/prayer-times");
  return response.data;
}