import { motion } from "framer-motion";
import { IconButton } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import type { ShoppingItem } from "../../types";

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggle: (id: number) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: number) => void;
}

function PencilIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
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

function CheckBox({ checked }: { checked: boolean }) {
  if (checked) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
    </svg>
  );
}

function ShoppingRow({ item, onToggle, onEdit, onDelete }: { item: ShoppingItem; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="flex items-center gap-3 py-3 px-3 rounded-xl bg-white border border-border dark:bg-surface-dark-dim dark:border-border-dark"
      {...longPress}
    >
      <button
        onClick={onToggle}
        className={`shrink-0 transition-colors ${
          item.is_purchased
            ? "text-success"
            : "text-border dark:text-border-dark"
        }`}
      >
        <CheckBox checked={item.is_purchased} />
      </button>

      <div
        onClick={() => {
          if (!longPress.wasLongPress()) onToggle();
        }}
        className="flex-1 min-w-0 cursor-pointer"
      >
        <p
          className={`text-lg transition-colors ${
            item.is_purchased
              ? "line-through text-text-muted dark:text-text-dark-muted"
              : "text-text dark:text-text-dark"
          }`}
        >
          {item.name}
        </p>
      </div>

      <IconButton
        icon={<PencilIcon />}
        label={`Edit ${item.name}`}
        onClick={onEdit}
      />
      <IconButton
        icon={<TrashIcon />}
        variant="danger"
        label={`Delete ${item.name}`}
        onClick={onDelete}
      />
    </motion.div>
  );
}

export default function ShoppingList({ items, onToggle, onEdit, onDelete }: ShoppingListProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ShoppingRow
          key={item.id}
          item={item}
          onToggle={() => onToggle(item.id)}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </div>
  );
}