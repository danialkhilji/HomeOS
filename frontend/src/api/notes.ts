import apiClient from "./client";
import type { Note } from "../types";

export interface CreateNotePayload {
  content: string;
  author_id?: number | null;
}

export interface UpdateNotePayload {
  content: string;
}

export async function fetchNotes(): Promise<Note[]> {
  const response = await apiClient.get<Note[]>("/notes");
  return response.data;
}

export async function createNote(data: CreateNotePayload): Promise<Note> {
  const response = await apiClient.post<Note>("/notes", data);
  return response.data;
}

export async function updateNote(id: number, data: UpdateNotePayload): Promise<Note> {
  const response = await apiClient.put<Note>(`/notes/${id}`, data);
  return response.data;
}

export async function deleteNote(id: number): Promise<void> {
  await apiClient.delete(`/notes/${id}`);
}
