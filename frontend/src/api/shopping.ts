import apiClient from "./client";
import type { ShoppingItem } from "../types";

export interface CreateShoppingItemPayload {
  name: string;
  store_id?: number | null;
}

export interface UpdateShoppingItemPayload {
  name: string;
  store_id?: number | null;
}

export async function fetchShoppingItems(): Promise<ShoppingItem[]> {
  const response = await apiClient.get<ShoppingItem[]>("/shopping");
  return response.data;
}

export async function createShoppingItem(data: CreateShoppingItemPayload): Promise<ShoppingItem> {
  const response = await apiClient.post<ShoppingItem>("/shopping", data);
  return response.data;
}

export async function updateShoppingItem(id: number, data: UpdateShoppingItemPayload): Promise<ShoppingItem> {
  const response = await apiClient.put<ShoppingItem>(`/shopping/${id}`, data);
  return response.data;
}

export async function toggleShoppingItem(id: number): Promise<ShoppingItem> {
  const response = await apiClient.patch<ShoppingItem>(`/shopping/${id}/toggle`);
  return response.data;
}

export async function reorderShoppingItems(ids: number[]): Promise<void> {
  await apiClient.patch("/shopping/reorder", { ids });
}

export async function deleteShoppingItem(id: number): Promise<void> {
  await apiClient.delete(`/shopping/${id}`);
}
