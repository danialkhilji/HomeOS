import { useState } from "react";
import { Modal, Button } from "../../components";

interface AddQuickAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string) => void;
}

export default function AddQuickAddModal({ open, onClose, onSave }: AddQuickAddModalProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");

  function handleSave() {
    const trimmedName = name.trim();
    const trimmedEmoji = emoji.trim();
    if (!trimmedName || !trimmedEmoji) return;
    onSave(trimmedName, trimmedEmoji);
    setName("");
    setEmoji("");
  }

  function handleClose() {
    setName("");
    setEmoji("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Quick Item">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Emoji
          </label>
          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="e.g. 🥛"
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-2xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Item Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter item name"
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave} disabled={!name.trim() || !emoji.trim()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
