import apiClient from "./client";
import type { QuickAddItem } from "../types";

export interface CreateQuickAddPayload {
  name: string;
  emoji: string;
}

export async function fetchQuickAddItems(): Promise<QuickAddItem[]> {
  const response = await apiClient.get<QuickAddItem[]>("/quick-add");
  return response.data;
}

export async function createQuickAddItem(data: CreateQuickAddPayload): Promise<QuickAddItem> {
  const response = await apiClient.post<QuickAddItem>("/quick-add", data);
  return response.data;
}

export async function deleteQuickAddItem(id: number): Promise<void> {
  await apiClient.delete(`/quick-add/${id}`);
}
