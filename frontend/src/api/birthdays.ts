import apiClient from "./client";
import type { Birthday, UpcomingBirthday } from "../types";

export interface CreateBirthdayPayload {
  name: string;
  month: number;
  day: number;
}

export async function fetchBirthdays(): Promise<Birthday[]> {
  const response = await apiClient.get<Birthday[]>("/birthdays");
  return response.data;
}

export async function fetchUpcomingBirthdays(days = 7): Promise<UpcomingBirthday[]> {
  const response = await apiClient.get<UpcomingBirthday[]>("/birthdays/upcoming", { params: { days } });
  return response.data;
}

export async function fetchBirthdaysByDate(month: number, day: number): Promise<Birthday[]> {
  const response = await apiClient.get<Birthday[]>("/birthdays/by-date", { params: { month, day } });
  return response.data;
}

export async function createBirthday(data: CreateBirthdayPayload): Promise<Birthday> {
  const response = await apiClient.post<Birthday>("/birthdays", data);
  return response.data;
}

export async function deleteBirthday(id: number): Promise<void> {
  await apiClient.delete(`/birthdays/${id}`);
}
