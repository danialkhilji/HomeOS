import WeatherCard from "./WeatherCard";
import TasksCard from "./TasksCard";
import ShoppingCard from "./ShoppingCard";
import NotesCard from "./NotesCard";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <WeatherCard />
      <TasksCard />
      <ShoppingCard />
      <NotesCard />
    </div>
  );
}
