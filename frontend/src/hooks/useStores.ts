import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStores, createStore, updateStore, deleteStore } from "../api/stores";
import type { CreateStorePayload, UpdateStorePayload } from "../api/stores";

const STORES_KEY = ["stores"];

export function useStores() {
  return useQuery({
    queryKey: STORES_KEY,
    queryFn: fetchStores,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStorePayload) => createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORES_KEY });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStorePayload }) => updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORES_KEY });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STORES_KEY });
      queryClient.invalidateQueries({ queryKey: ["shopping"] });
    },
  });
}
