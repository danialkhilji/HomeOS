import { BinIcon, Button, Modal } from "../../components";
import type { BinCollection } from "../../types";
import { formatLongDate, formatRelativeDays } from "./binDates";

interface BinScheduleModalProps {
  open: boolean;
  onClose: () => void;
  collections: BinCollection[];
}

export default function BinScheduleModal({ open, onClose, collections }: BinScheduleModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Upcoming Collections">
      <div className="space-y-3 pt-2">
        {collections.map((collection) => (
          <div key={collection.date} className="rounded-xl border border-border bg-surface-dim p-4">
            <p className="text-lg font-semibold text-text">
              {formatLongDate(collection.date)}
            </p>
            <p className="text-sm text-text-muted">
              {formatRelativeDays(collection.days_until)}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {collection.bins.map((bin) => (
                <div key={bin.id} className="flex items-center gap-2">
                  <BinIcon icon={bin.icon} colour={bin.colour} size={32} />
                  <span className="text-base text-text">{bin.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button fullWidth variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
