import apiClient from "./client";
import type { Store } from "../types";

export interface CreateStorePayload {
  name: string;
  colour: string;
}

export interface UpdateStorePayload {
  name: string;
  colour: string;
}

export async function fetchStores(): Promise<Store[]> {
  const response = await apiClient.get<Store[]>("/stores");
  return response.data;
}

export async function createStore(data: CreateStorePayload): Promise<Store> {
  const response = await apiClient.post<Store>("/stores", data);
  return response.data;
}

export async function updateStore(id: number, data: UpdateStorePayload): Promise<Store> {
  const response = await apiClient.put<Store>(`/stores/${id}`, data);
  return response.data;
}

export async function deleteStore(id: number): Promise<void> {
  await apiClient.delete(`/stores/${id}`);
}
