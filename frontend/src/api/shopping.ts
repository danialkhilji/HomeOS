import apiClient from "./client";
import type { ShoppingItem } from "../types";

export interface CreateShoppingItemPayload {
  name: string;
}

export interface UpdateShoppingItemPayload {
  name: string;
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

export async function deleteShoppingItem(id: number): Promise<void> {
  await apiClient.delete(`/shopping/${id}`);
}
