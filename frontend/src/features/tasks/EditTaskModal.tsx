import { useState, useEffect } from "react";
import { Modal, Button } from "../../components";
import { useMembers } from "../../hooks/useMembers";
import type { Task } from "../../types";

const RECURRENCE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function toLocalDatetime(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, assignedTo: number | null, reminderAt: string | null, recurrence: string) => void;
  task: Task | null;
}

export default function EditTaskModal({ open, onClose, onSave, task }: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState<number | null>(null);
  const [reminderAt, setReminderAt] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const { data: members = [] } = useMembers();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setAssignedTo(task.assigned_to);
      setReminderAt(toLocalDatetime(task.reminder_at));
      setRecurrence(task.recurrence);
    }
  }, [task]);

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, assignedTo, reminderAt || null, recurrence);
  }

  const inputStyle = "w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Task
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Assign to
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAssignedTo(null)}
              className={`min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                assignedTo === null
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border text-text-muted"
              }`}
            >
              Unassigned
            </button>
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setAssignedTo(member.id)}
                className={`flex items-center gap-2 min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                  assignedTo === member.id
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border text-text-muted"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0"
                  style={{ backgroundColor: member.colour }}
                />
                {member.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Reminder
          </label>
          <input
            type="datetime-local"
            value={reminderAt}
            onChange={(e) => setReminderAt(e.target.value)}
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Repeat
          </label>
          <div className="flex flex-wrap gap-2">
            {RECURRENCE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRecurrence(opt.value)}
                className={`min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                  recurrence === opt.value
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border text-text-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave} disabled={!title.trim()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
