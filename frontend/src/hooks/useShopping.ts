import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchShoppingItems,
  createShoppingItem,
  updateShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
} from "../api/shopping";
import type { CreateShoppingItemPayload, UpdateShoppingItemPayload } from "../api/shopping";

const SHOPPING_KEY = ["shopping"];

export function useShoppingItems() {
  return useQuery({
    queryKey: SHOPPING_KEY,
    queryFn: fetchShoppingItems,
  });
}

export function useCreateShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShoppingItemPayload) => createShoppingItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_KEY });
    },
  });
}

export function useUpdateShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateShoppingItemPayload }) => updateShoppingItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_KEY });
    },
  });
}

export function useToggleShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleShoppingItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_KEY });
    },
  });
}

export function useDeleteShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteShoppingItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOPPING_KEY });
    },
  });
}
