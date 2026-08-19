import { useState } from "react";
import { Modal, Button } from "../../components";
import { PRESET_COLOURS } from "../../constants";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, colour: string) => void;
}

export default function AddMemberModal({ open, onClose, onSave }: AddMemberModalProps) {
  const [name, setName] = useState("");
  const [colour, setColour] = useState(PRESET_COLOURS[0]!);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, colour);
    setName("");
    setColour(PRESET_COLOURS[0]!);
  }

  function handleClose() {
    setName("");
    setColour(PRESET_COLOURS[0]!);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Member">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
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
