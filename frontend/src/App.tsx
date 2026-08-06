import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import TasksPage from "./features/tasks/TasksPage";
import ShoppingPage from "./features/shopping/ShoppingPage";
import NotesPage from "./features/notes/NotesPage";
import SettingsPage from "./features/settings/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="shopping" element={<ShoppingPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
