import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import {
  HomeIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  NotepadIcon,
  SettingsIcon,
} from "../components/icons";

const navItems = [
  { to: "/", label: "Dashboard", icon: HomeIcon },
  { to: "/tasks", label: "Tasks", icon: CheckCircleIcon },
  { to: "/shopping", label: "Shopping", icon: ShoppingCartIcon },
  { to: "/notes", label: "Notes", icon: NotepadIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AppLayout() {
  const location = useLocation();
  const [now, setNow] = useState(new Date());
  const { data: prayerData } = usePrayerTimes();

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-dvh bg-surface text-text dark:bg-surface-dark dark:text-text-dark transition-colors">
      <header className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-border dark:border-border-dark">
        <span className="text-lg font-bold text-primary shrink-0">HomeOS</span>
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-text-muted dark:text-text-dark-muted overflow-hidden">
          {prayerData?.hijri_date && (
            <span className="hidden sm:inline">{prayerData.hijri_date}</span>
          )}
          {prayerData?.hijri_date && (
            <span className="hidden sm:inline text-text-muted dark:text-text-dark-muted">|</span>
          )}
          <span className="truncate">{formatDate(now)}</span>
          <span className="font-semibold text-text dark:text-text-dark shrink-0">{formatTime(now)}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="flex shrink-0 border-t border-border bg-surface dark:border-border-dark dark:bg-surface-dark-dim">
        {navItems.map((item) => (
          <motion.div
            key={item.to}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex-1"
          >
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 sm:gap-1 py-2 sm:py-3 text-xs transition-colors ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-text-muted dark:text-text-dark-muted"
                }`
              }
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>
    </div>
  );
}