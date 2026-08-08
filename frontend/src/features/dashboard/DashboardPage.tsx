import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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

  return (
    <div className="space-y-4">
      <WeatherCard />
      <TasksCard />
      <ShoppingCard />
      <NotesCard />
    </div>
  );
}
