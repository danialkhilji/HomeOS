import apiClient from "./client";
import type { Bin, BinIconType, BinScheduleType, BinSettings, BinScheduleResponse } from "../types";

export interface CreateBinPayload {
  name: string;
  colour: string;
  icon: BinIconType;
  schedule: BinScheduleType;
}

export type UpdateBinPayload = CreateBinPayload;

export async function fetchBins(): Promise<Bin[]> {
  const response = await apiClient.get<Bin[]>("/bins");
  return response.data;
}

export async function createBin(data: CreateBinPayload): Promise<Bin> {
  const response = await apiClient.post<Bin>("/bins", data);
  return response.data;
}

export async function updateBin(id: number, data: UpdateBinPayload): Promise<Bin> {
  const response = await apiClient.put<Bin>(`/bins/${id}`, data);
  return response.data;
}

export async function deleteBin(id: number): Promise<void> {
  await apiClient.delete(`/bins/${id}`);
}

export async function toggleBinPutOut(id: number): Promise<Bin> {
  const response = await apiClient.patch<Bin>(`/bins/${id}/put-out`);
  return response.data;
}

export async function fetchBinSettings(): Promise<BinSettings | null> {
  const response = await apiClient.get<BinSettings | null>("/bins/settings");
  return response.data;
}

export async function updateBinSettings(data: BinSettings): Promise<BinSettings> {
  const response = await apiClient.put<BinSettings>("/bins/settings", data);
  return response.data;
}

export async function fetchBinSchedule(weeks: number): Promise<BinScheduleResponse> {
  const response = await apiClient.get<BinScheduleResponse>("/bins/schedule", {
    params: { weeks },
  });
  return response.data;
}
