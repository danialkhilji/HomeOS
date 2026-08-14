import { useState } from "react";
import { Modal, Button } from "../../components";
import { useMembers } from "../../hooks/useMembers";

const RECURRENCE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, assignedTo: number | null, reminderAt: string | null, recurrence: string) => void;
}

export default function AddTaskModal({ open, onClose, onSave }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState<number | null>(null);
  const [reminderAt, setReminderAt] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const { data: members = [] } = useMembers();

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, assignedTo, reminderAt || null, recurrence);
    setTitle("");
    setAssignedTo(null);
    setReminderAt("");
    setRecurrence("none");
  }

  function handleClose() {
    setTitle("");
    setAssignedTo(null);
    setReminderAt("");
    setRecurrence("none");
    onClose();
  }

  const inputStyle = "w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <Modal open={open} onClose={handleClose} title="Add Task">
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
