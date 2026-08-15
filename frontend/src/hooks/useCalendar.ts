import { useQuery } from "@tanstack/react-query";
import { fetchCalendarByDate } from "../api/calendar";

export function useCalendarDate(date: string | null) {
  return useQuery({
    queryKey: ["calendar", date],
    queryFn: () => fetchCalendarByDate(date!),
    enabled: date !== null,
  });
}
