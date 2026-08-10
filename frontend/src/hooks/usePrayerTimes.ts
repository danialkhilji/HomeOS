import { useQuery } from "@tanstack/react-query";
import { fetchPrayerTimes } from "../api/prayer";

export function usePrayerTimes() {
  return useQuery({
    queryKey: ["prayer-times"],
    queryFn: fetchPrayerTimes,
    staleTime: 60 * 60 * 1000,
  });
}