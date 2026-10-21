import { motion } from "framer-motion";
import { IconButton, TrashIcon, BinIcon } from "../../components";
import { TAP_SPRING, BIN_WEEK_LABELS } from "../../constants";
import { toBinWeek } from "../dashboard/binDates";
import { useLongPress } from "../../hooks/useLongPress";
import type { Bin } from "../../types";

interface BinListProps {
  bins: Bin[];
  onEdit: (bin: Bin) => void;
  onDelete: (id: number) => void;
  upcomingWeek: "A" | "B";
}

function BinRow({ bin, weekLabel, onEdit, onDelete }: { bin: Bin; weekLabel: string; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={TAP_SPRING}
      className="flex items-center justify-between py-2"
      {...longPress}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="shrink-0">
          <BinIcon icon={bin.icon} colour={bin.colour} size={36} />
        </div>
        <div className="min-w-0">
          <p className="text-lg truncate">{bin.name}</p>
          <p className="text-sm text-text-muted">{weekLabel}</p>
        </div>
      </div>
      <IconButton
        icon={<TrashIcon />}
        variant="danger"
        label={`Delete ${bin.name}`}
        onClick={onDelete}
      />
    </motion.div>
  );
}

export default function BinList({ bins, onEdit, onDelete, upcomingWeek }: BinListProps) {
  return (
    <div className="space-y-2">
      {bins.map((bin) => (
        <BinRow
          key={bin.id}
          bin={bin}
          weekLabel={BIN_WEEK_LABELS[toBinWeek(bin.schedule, upcomingWeek)]}
          onEdit={() => onEdit(bin)}
          onDelete={() => onDelete(bin.id)}
        />
      ))}
    </div>
  );
}
