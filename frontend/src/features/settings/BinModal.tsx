import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Modal, Button, ColourPicker, BinIcon } from "../../components";
import { INPUT_STYLE, TAP_SPRING, BIN_COLOURS, BIN_TYPES, BIN_WEEK_LABELS } from "../../constants";
import type { BinWeek } from "../../constants";
import { toBinSchedule, toBinWeek } from "../dashboard/binDates";
import type { CreateBinPayload } from "../../api/bins";
import type { Bin, BinIconType } from "../../types";

interface BinModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateBinPayload) => void;
  bin: Bin | null;
  upcomingWeek: "A" | "B";
}

const WEEKS: BinWeek[] = ["weekly", "this_week", "next_week"];
const DEFAULT_TYPE = BIN_TYPES[0]!;

export default function BinModal({ open, onClose, onSave, bin, upcomingWeek }: BinModalProps) {
  const isEdit = bin !== null;
  const [icon, setIcon] = useState<BinIconType>(DEFAULT_TYPE.icon);
  const [name, setName] = useState(DEFAULT_TYPE.name);
  const [colour, setColour] = useState(DEFAULT_TYPE.colour);
  const [week, setWeek] = useState<BinWeek>("weekly");
  const [nameEdited, setNameEdited] = useState(false);
  const [colourEdited, setColourEdited] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIcon(bin?.icon ?? DEFAULT_TYPE.icon);
    setName(bin?.name ?? DEFAULT_TYPE.name);
    setColour(bin?.colour ?? DEFAULT_TYPE.colour);
    setWeek(bin ? toBinWeek(bin.schedule, upcomingWeek) : "weekly");
    setNameEdited(false);
    setColourEdited(false);
  }, [open, bin, upcomingWeek]);

  function handleSelectType(type: BinIconType) {
    setIcon(type);
    if (isEdit) return;
    const option = BIN_TYPES.find((t) => t.icon === type);
    if (!option) return;
    if (!nameEdited || !name.trim()) setName(option.name);
    if (!colourEdited) setColour(option.colour);
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, colour, icon, schedule: toBinSchedule(week, upcomingWeek) });
    if (!isEdit) setName("");
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit Bin" : "Add Bin"}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Bin Type
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
                  className={`flex flex-col items-center gap-1 px-1 py-3 rounded-xl border text-sm leading-tight text-center transition-colors ${
                    selected
                      ? "border-primary ring-2 ring-primary bg-primary/10 text-primary font-semibold"
                      : "border-border text-text-muted"
                  }`}
                >
                  <BinIcon icon={type.icon} colour={selected ? colour : type.colour} size={40} />
                  {type.name}
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
            Collected
          </label>
          <div className="flex gap-2">
            {WEEKS.map((value) => (
              <motion.button
                key={value}
                type="button"
                whileTap={{ scale: 0.95 }}
                transition={TAP_SPRING}
                onClick={() => setWeek(value)}
                aria-pressed={week === value}
                className={`flex-1 min-h-[48px] px-2 rounded-xl border text-base transition-colors ${
                  week === value
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border text-text-muted"
                }`}
              >
                {BIN_WEEK_LABELS[value]}
              </motion.button>
            ))}
          </div>
          {week !== "weekly" && (
            <p className="text-sm text-text-muted mt-2">
              Then every other week after that.
            </p>
          )}
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
