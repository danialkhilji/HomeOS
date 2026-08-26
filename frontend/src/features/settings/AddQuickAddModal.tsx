import { useState } from "react";
import { Modal, Button } from "../../components";
import { INPUT_STYLE } from "../../constants";

interface AddQuickAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, emoji: string) => void;
}

function splitEmojiAndName(input: string): { emoji: string; name: string } {
  const trimmed = input.trim();
  if (!trimmed) return { emoji: "", name: "" };

  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;
  const match = trimmed.match(emojiRegex);

  if (match) {
    const emoji = match[0];
    const name = trimmed.slice(emoji.length).trim();
    return { emoji, name };
  }

  return { emoji: "", name: trimmed };
}

export default function AddQuickAddModal({ open, onClose, onSave }: AddQuickAddModalProps) {
  const [value, setValue] = useState("");

  const { emoji, name } = splitEmojiAndName(value);
  const canSave = name.length > 0;

  function handleSave() {
    if (!canSave) return;
    onSave(name, emoji || "🛒");
    setValue("");
  }

  function handleClose() {
    setValue("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Quick Item">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Item
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 🥛 Milk"
            autoFocus
            className={INPUT_STYLE}
          />
          <p className="text-xs text-text-muted mt-1">
            Start with an emoji, or just type the name
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave} disabled={!canSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}