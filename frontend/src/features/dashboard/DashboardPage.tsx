import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { PullToRefresh } from "../../components";
import WeatherCard from "./WeatherCard";
import CalendarWidget from "../calendar/CalendarWidget";
import CalendarModal from "../calendar/CalendarModal";
import PrayerTimesBar from "./PrayerTimesBar";
import TasksCard from "./TasksCard";
import ShoppingCard from "./ShoppingCard";
import NotesCard from "./NotesCard";
import BirthdayCard from "../calendar/BirthdayCard";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["shopping"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["birthdays"] });
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
      queryClient.invalidateQueries({ queryKey: ["birthdays"] }),
    ]);
  }, [queryClient]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WeatherCard />
          <CalendarWidget onExpand={() => setCalendarOpen(true)} />
        </div>
        <PrayerTimesBar />
        <BirthdayCard />
        <TasksCard />
        <ShoppingCard />
        <NotesCard />
      </div>

      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
      />
    </PullToRefresh>
  );
}
