import apiClient from "./client";
import type { CalendarDateResponse } from "../types";

export async function fetchCalendarByDate(date: string): Promise<CalendarDateResponse> {
  const response = await apiClient.get<CalendarDateResponse>("/calendar/by-date", { params: { date } });
  return response.data;
}
