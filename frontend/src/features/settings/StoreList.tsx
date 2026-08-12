import { motion } from "framer-motion";
import { IconButton } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import type { Store } from "../../types";

interface StoreListProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (id: number) => void;
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function StoreRow({ store, onEdit, onDelete }: { store: Store; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="flex items-center justify-between py-2"
      {...longPress}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full shrink-0"
          style={{ backgroundColor: store.colour }}
        />
        <span className="text-lg">{store.name}</span>
      </div>
      <IconButton
        icon={<TrashIcon />}
        variant="danger"
        label={`Delete ${store.name}`}
        onClick={onDelete}
      />
    </motion.div>
  );
}

export default function StoreList({ stores, onEdit, onDelete }: StoreListProps) {
  return (
    <div className="space-y-2">
      {stores.map((store) => (
        <StoreRow
          key={store.id}
          store={store}
          onEdit={() => onEdit(store)}
          onDelete={() => onDelete(store.id)}
        />
      ))}
    </div>
  );
}
