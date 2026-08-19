import { motion } from "framer-motion";
import { IconButton, TrashIcon } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import type { Store } from "../../types";

interface StoreListProps {
  stores: Store[];
  onEdit: (store: Store) => void;
  onDelete: (id: number) => void;
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
