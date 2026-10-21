import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal, Button, ColourPicker, BinIcon } from "../../components";
import { INPUT_STYLE, TAP_SPRING, BIN_COLOURS, BIN_TYPES, BIN_SCHEDULE_LABELS } from "../../constants";
import type { CreateBinPayload } from "../../api/bins";
import type { Bin, BinIconType, BinScheduleType } from "../../types";

interface BinModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateBinPayload) => void;
  bin: Bin | null;
}

const SCHEDULES: BinScheduleType[] = ["weekly", "week_a", "week_b"];
const DEFAULT_TYPE = BIN_TYPES[0]!;

export default function BinModal({ open, onClose, onSave, bin }: BinModalProps) {
  const isEdit = bin !== null;
  const [icon, setIcon] = useState<BinIconType>(DEFAULT_TYPE.icon);
  const [name, setName] = useState(DEFAULT_TYPE.defaultName);
  const [colour, setColour] = useState(DEFAULT_TYPE.defaultColour);
  const [schedule, setSchedule] = useState<BinScheduleType>("weekly");
  const [nameEdited, setNameEdited] = useState(false);
  const [colourEdited, setColourEdited] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIcon(bin?.icon ?? DEFAULT_TYPE.icon);
    setName(bin?.name ?? DEFAULT_TYPE.defaultName);
    setColour(bin?.colour ?? DEFAULT_TYPE.defaultColour);
    setSchedule(bin?.schedule ?? "weekly");
    setNameEdited(false);
    setColourEdited(false);
  }, [open, bin]);

  function handleSelectType(type: BinIconType) {
    setIcon(type);
    if (isEdit) return;
    const option = BIN_TYPES.find((t) => t.icon === type);
    if (!option) return;
    if (!nameEdited || !name.trim()) setName(option.defaultName);
    if (!colourEdited) setColour(option.defaultColour);
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, colour, icon, schedule });
    if (!isEdit) setName("");
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Bin" : "Add Bin"}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Bin Type
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {BIN_TYPES.map((type) => {
              const selected = icon === type.icon;
              return (
                <motion.button
                  key={type.icon}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  transition={TAP_SPRING}
                  onClick={() => handleSelectType(type.icon)}
                  aria-pressed={selected}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-sm transition-colors ${
                    selected
                      ? "border-primary ring-2 ring-primary bg-primary/10 text-primary font-semibold"
                      : "border-border text-text-muted"
                  }`}
                >
                  <BinIcon icon={type.icon} colour={selected ? colour : type.defaultColour} size={40} />
                  {type.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Bin Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameEdited(true); }}
            placeholder="Enter bin name"
            className={INPUT_STYLE}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Colour
          </label>
          <ColourPicker
            colours={BIN_COLOURS}
            selected={colour}
            onSelect={(c) => { setColour(c); setColourEdited(true); }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Schedule
          </label>
          <div className="flex gap-2">
            {SCHEDULES.map((value) => (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={TAP_SPRING}
                onClick={() => setSchedule(value)}
                aria-pressed={schedule === value}
                className={`flex-1 min-h-[48px] px-2 rounded-xl border text-base transition-colors ${
                  schedule === value
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border text-text-muted"
                }`}
              >
                {BIN_SCHEDULE_LABELS[value]}
              </motion.button>
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
