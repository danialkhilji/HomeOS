import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBins,
  createBin,
  updateBin,
  deleteBin,
  fetchBinSettings,
  updateBinSettings,
  fetchBinSchedule,
} from "../api/bins";
import type { CreateBinPayload, UpdateBinPayload } from "../api/bins";
import type { BinSettings } from "../types";

const BINS_KEY = ["bins"];

export function useBins() {
  return useQuery({
    queryKey: [...BINS_KEY, "list"],
    queryFn: fetchBins,
  });
}

export function useBinSettings() {
  return useQuery({
    queryKey: [...BINS_KEY, "settings"],
    queryFn: fetchBinSettings,
  });
}

export function useBinSchedule(weeks = 6) {
  return useQuery({
    queryKey: [...BINS_KEY, "schedule", weeks],
    queryFn: () => fetchBinSchedule(weeks),
  });
}

export function useCreateBin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBinPayload) => createBin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BINS_KEY });
    },
  });
}

export function useUpdateBin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBinPayload }) => updateBin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BINS_KEY });
    },
  });
}

export function useDeleteBin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BINS_KEY });
    },
  });
}

export function useUpdateBinSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BinSettings) => updateBinSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BINS_KEY });
    },
  });
}
