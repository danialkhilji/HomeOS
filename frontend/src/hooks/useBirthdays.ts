import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBirthdays, fetchUpcomingBirthdays, fetchBirthdaysByDate, createBirthday, deleteBirthday } from "../api/birthdays";
import type { CreateBirthdayPayload } from "../api/birthdays";

const BIRTHDAYS_KEY = ["birthdays"];

export function useBirthdays() {
  return useQuery({
    queryKey: BIRTHDAYS_KEY,
    queryFn: fetchBirthdays,
  });
}

export function useUpcomingBirthdays(days = 7) {
  return useQuery({
    queryKey: [...BIRTHDAYS_KEY, "upcoming", days],
    queryFn: () => fetchUpcomingBirthdays(days),
  });
}

export function useBirthdaysByDate(month: number | null, day: number | null) {
  return useQuery({
    queryKey: [...BIRTHDAYS_KEY, "by-date", month, day],
    queryFn: () => fetchBirthdaysByDate(month!, day!),
    enabled: month !== null && day !== null,
  });
}

export function useCreateBirthday() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBirthdayPayload) => createBirthday(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BIRTHDAYS_KEY });
    },
  });
}

export function useDeleteBirthday() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBirthday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BIRTHDAYS_KEY });
    },
  });
}
