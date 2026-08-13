import apiClient from "./client";
import type { Task } from "../types";

export interface CreateTaskPayload {
  title: string;
  assigned_to?: number | null;
  reminder_at?: string | null;
  recurrence?: string;
}

export interface UpdateTaskPayload {
  title: string;
  assigned_to?: number | null;
  reminder_at?: string | null;
  recurrence?: string;
}

export async function fetchTasks(assignedTo?: number): Promise<Task[]> {
  const params = assignedTo !== undefined ? { assigned_to: assignedTo } : {};
  const response = await apiClient.get<Task[]>("/tasks", { params });
  return response.data;
}

export async function createTask(data: CreateTaskPayload): Promise<Task> {
  const response = await apiClient.post<Task>("/tasks", data);
  return response.data;
}

export async function updateTask(id: number, data: UpdateTaskPayload): Promise<Task> {
  const response = await apiClient.put<Task>(`/tasks/${id}`, data);
  return response.data;
}

export async function toggleTask(id: number): Promise<Task> {
  const response = await apiClient.patch<Task>(`/tasks/${id}/toggle`);
  return response.data;
}

export async function reorderTasks(ids: number[]): Promise<void> {
  await apiClient.patch("/tasks/reorder", { ids });
}

export async function deleteTask(id: number): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}
