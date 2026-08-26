import { useState, useEffect } from "react";
import { Modal, Button, MemberDot } from "../../components";
import { useMembers } from "../../hooks/useMembers";
import { INPUT_STYLE } from "../../constants";
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

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, assignedTo: number | null, reminderAt: string | null, recurrence: string) => void;
  task?: Task | null;
}

export default function TaskModal({ open, onClose, onSave, task = null }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState<number | null>(null);
  const [reminderAt, setReminderAt] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const { data: members = [] } = useMembers();

  const isEditMode = task !== null;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setAssignedTo(task.assigned_to);
      setReminderAt(toLocalDatetime(task.reminder_at));
      setRecurrence(task.recurrence);
    } else {
      resetForm();
    }
  }, [task]);

  function resetForm() {
    setTitle("");
    setAssignedTo(null);
    setReminderAt("");
    setRecurrence("none");
  }

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, assignedTo, reminderAt || null, recurrence);
    if (!isEditMode) {
      resetForm();
    }
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  const inputStyle = INPUT_STYLE;

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? "Edit Task" : "Add Task"}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Task
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task name"
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
                <MemberDot avatarUrl={member.avatar_url} colour={member.colour} name={member.name} size={30} />
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
          <Button variant="secondary" fullWidth onClick={handleClose}>
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
