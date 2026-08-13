import { IconButton } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../types";

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

function GripIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
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

export function TaskRow({ task, onToggle, onEdit, onDelete }: { task: Task; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-3 px-3 rounded-xl bg-white border border-border dark:bg-surface-dark-dim dark:border-border-dark"
    >
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing text-text-muted dark:text-text-dark-muted touch-none"
      >
        <GripIcon />
      </div>

      <button
        onClick={onToggle}
        className={`shrink-0 transition-colors ${
          task.is_completed
            ? "text-success"
            : "text-border dark:text-border-dark"
        }`}
      >
        <CheckCircle filled={task.is_completed} />
      </button>

      <div
        {...longPress}
        onClick={() => {
          if (!longPress.wasLongPress()) onToggle();
        }}
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
        {(task.reminder_at || task.recurrence !== "none") && (
          <div className="flex items-center gap-2 mt-0.5">
            {task.reminder_at && (
              <span className={`text-xs ${
                new Date(task.reminder_at) < new Date() && !task.is_completed
                  ? "text-danger font-semibold"
                  : "text-text-muted dark:text-text-dark-muted"
              }`}>
                🔔 {new Date(task.reminder_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} {new Date(task.reminder_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {task.recurrence !== "none" && (
              <span className="text-xs text-text-muted dark:text-text-dark-muted">
                🔁 {task.recurrence}
              </span>
            )}
          </div>
        )}
      </div>

      <IconButton
        icon={<TrashIcon />}
        variant="danger"
        label={`Delete ${task.title}`}
        onClick={onDelete}
      />
    </div>
  );
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggle={() => onToggle(task.id)}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}
