import { useState } from "react";
import { Modal, Button } from "../../components";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function AddItemModal({ open, onClose, onSave }: AddItemModalProps) {
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
    <Modal open={open} onClose={handleClose} title="Add Item">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            Item
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
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
