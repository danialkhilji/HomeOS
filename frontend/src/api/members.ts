import apiClient from "./client";
import type { Member } from "../types";

export interface CreateMemberPayload {
  name: string;
  colour: string;
}

export async function fetchMembers(): Promise<Member[]> {
  const response = await apiClient.get<Member[]>("/members");
  return response.data;
}

export async function createMember(data: CreateMemberPayload): Promise<Member> {
  const response = await apiClient.post<Member>("/members", data);
  return response.data;
}

export interface UpdateMemberPayload {
  name: string;
  colour: string;
}

export async function updateMember(id: number, data: UpdateMemberPayload): Promise<Member> {
  const response = await apiClient.put<Member>(`/members/${id}`, data);
  return response.data;
}

export async function deleteMember(id: number): Promise<void> {
  await apiClient.delete(`/members/${id}`);
}
