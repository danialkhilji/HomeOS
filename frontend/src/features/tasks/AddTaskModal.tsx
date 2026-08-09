import { useState } from "react";
import { Modal, Button } from "../../components";
import { useMembers } from "../../hooks/useMembers";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, assignedTo: number | null) => void;
}

export default function AddTaskModal({ open, onClose, onSave }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState<number | null>(null);
  const { data: members = [] } = useMembers();

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave(trimmed, assignedTo);
    setTitle("");
    setAssignedTo(null);
  }

  function handleClose() {
    setTitle("");
    setAssignedTo(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Task">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            Task
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task name"
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg dark:border-border-dark dark:bg-surface-dark-dim dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            Assign to
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAssignedTo(null)}
              className={`min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                assignedTo === null
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border text-text-muted dark:border-border-dark dark:text-text-dark-muted"
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
                    : "border-border text-text-muted dark:border-border-dark dark:text-text-dark-muted"
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
