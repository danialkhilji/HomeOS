import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMembers, createMember, deleteMember } from "../api/members";
import type { CreateMemberPayload } from "../api/members";

const MEMBERS_KEY = ["members"];

export function useMembers() {
  return useQuery({
    queryKey: MEMBERS_KEY,
    queryFn: fetchMembers,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMemberPayload) => createMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEY });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEY });
    },
  });
}
