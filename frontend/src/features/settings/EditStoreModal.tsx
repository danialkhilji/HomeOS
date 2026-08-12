import { useState, useEffect } from "react";
import { Modal, Button } from "../../components";
import type { Store } from "../../types";

const PRESET_COLOURS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#f97316",
  "#8b5cf6",
  "#0891b2",
  "#db2777",
  "#ca8a04",
];

interface EditStoreModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, colour: string) => void;
  store: Store | null;
}

export default function EditStoreModal({ open, onClose, onSave, store }: EditStoreModalProps) {
  const [name, setName] = useState("");
  const [colour, setColour] = useState(PRESET_COLOURS[0]!);

  useEffect(() => {
    if (store) {
      setName(store.name);
      setColour(store.colour);
    }
  }, [store]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, colour);
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Store">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            Store Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg dark:border-border-dark dark:bg-surface-dark-dim dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            Colour
          </label>
          <div className="flex gap-3 flex-wrap">
            {PRESET_COLOURS.map((c) => (
              <button
                key={c}
                onClick={() => setColour(c)}
                className={`w-12 h-12 rounded-full transition-transform ${
                  colour === c ? "ring-3 ring-offset-2 ring-primary scale-110" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
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
