import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { PullToRefresh } from "../../components";
import PrayerTimesBar from "./PrayerTimesBar";
import WeatherCard from "./WeatherCard";
import TasksCard from "./TasksCard";
import ShoppingCard from "./ShoppingCard";
import NotesCard from "./NotesCard";

export default function DashboardPage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["shopping"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [queryClient]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["weather"] }),
      queryClient.invalidateQueries({ queryKey: ["prayer-times"] }),
      queryClient.invalidateQueries({ queryKey: ["tasks"] }),
      queryClient.invalidateQueries({ queryKey: ["shopping"] }),
      queryClient.invalidateQueries({ queryKey: ["notes"] }),
    ]);
  }, [queryClient]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4">
        <WeatherCard />
        <PrayerTimesBar />
        <TasksCard />
        <ShoppingCard />
        <NotesCard />
      </div>
    </PullToRefresh>
  );
}