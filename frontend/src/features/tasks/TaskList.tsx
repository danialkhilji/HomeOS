import { motion } from "framer-motion";
import { IconButton } from "../../components";
import type { Task } from "../../types";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function CheckCircle({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex items-center gap-3 py-3 px-3 rounded-xl bg-white border border-border dark:bg-surface-dark-dim dark:border-border-dark"
        >
          <button
            onClick={() => onToggle(task.id)}
            className={`shrink-0 transition-colors ${
              task.is_completed
                ? "text-success"
                : "text-border dark:text-border-dark"
            }`}
          >
            <CheckCircle filled={task.is_completed} />
          </button>

          <div
            onClick={() => onToggle(task.id)}
            className="flex-1 min-w-0 cursor-pointer"
          >
            <p
              className={`text-lg transition-colors ${
                task.is_completed
                  ? "line-through text-text-muted dark:text-text-dark-muted"
                  : "text-text dark:text-text-dark"
              }`}
            >
              {task.title}
            </p>
            {task.member && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: task.member.colour }}
                />
                <span className="text-sm text-text-muted dark:text-text-dark-muted">
                  {task.member.name}
                </span>
              </div>
            )}
          </div>

          <IconButton
            icon={<TrashIcon />}
            variant="danger"
            label={`Delete ${task.title}`}
            onClick={() => onDelete(task.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
