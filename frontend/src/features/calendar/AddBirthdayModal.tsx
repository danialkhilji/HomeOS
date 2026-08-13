import { useState } from "react";
import { Modal, Button } from "../../components";

interface AddBirthdayModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  dateLabel: string;
}

export default function AddBirthdayModal({ open, onClose, onSave, dateLabel }: AddBirthdayModalProps) {
  const [name, setName] = useState("");

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setName("");
  }

  function handleClose() {
    setName("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Birthday">
      <div className="space-y-6">
        <p className="text-sm text-text-muted dark:text-text-dark-muted">
          Date: <span className="font-semibold text-text dark:text-text-dark">{dateLabel}</span>
        </p>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg dark:border-border-dark dark:bg-surface-dark-dim dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
