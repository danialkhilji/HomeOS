import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchQuickAddItems, createQuickAddItem, deleteQuickAddItem } from "../api/quickAdd";
import type { CreateQuickAddPayload } from "../api/quickAdd";

const QUICK_ADD_KEY = ["quick-add"];

export function useQuickAddItems() {
  return useQuery({
    queryKey: QUICK_ADD_KEY,
    queryFn: fetchQuickAddItems,
  });
}

export function useCreateQuickAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuickAddPayload) => createQuickAddItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUICK_ADD_KEY });
    },
  });
}

export function useDeleteQuickAddItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteQuickAddItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUICK_ADD_KEY });
    },
  });
}
