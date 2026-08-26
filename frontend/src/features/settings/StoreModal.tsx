import { useState, useEffect } from "react";
import { Modal, Button, ColourPicker } from "../../components";
import { INPUT_STYLE, PRESET_COLOURS } from "../../constants";
import type { Store } from "../../types";

interface StoreModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, colour: string) => void;
  store: Store | null;
}

export default function StoreModal({ open, onClose, onSave, store }: StoreModalProps) {
  const isEdit = store !== null;
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
    if (!isEdit) resetForm();
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function resetForm() {
    setName("");
    setColour(PRESET_COLOURS[0]!);
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEdit ? "Edit Store" : "Add Store"}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Store Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={isEdit ? undefined : "Enter store name"}
            autoFocus
            className={INPUT_STYLE}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Colour
          </label>
          <ColourPicker colours={PRESET_COLOURS} selected={colour} onSelect={setColour} />
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
