import { IconButton, TrashIcon } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ShoppingItem } from "../../types";

interface ShoppingListProps {
  items: ShoppingItem[];
  onToggle: (id: number) => void;
  onEdit: (item: ShoppingItem) => void;
  onDelete: (id: number) => void;
}

function GripIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
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

export function ShoppingRow({ item, onToggle, onEdit, onDelete }: { item: ShoppingItem; onToggle: () => void; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 py-3 px-3 rounded-xl bg-white border border-border"
    >
      <div
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing text-text-muted touch-none"
      >
        <GripIcon />
      </div>

      <button
        onClick={onToggle}
        className={`shrink-0 transition-colors ${
          item.is_purchased
            ? "text-success"
            : "text-border"
        }`}
      >
        <CheckBox checked={item.is_purchased} />
      </button>

      <div
        {...longPress}
        onClick={() => {
          if (!longPress.wasLongPress()) onToggle();
        }}
        className="flex-1 min-w-0 cursor-pointer"
      >
        <p
          className={`text-lg transition-colors ${
            item.is_purchased
              ? "line-through text-text-muted"
              : "text-text"
          }`}
        >
          {item.name}
        </p>
        {item.store && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.store.colour }}
            />
            <span className="text-sm text-text-muted">
              {item.store.name}
            </span>
          </div>
        )}
      </div>

      <IconButton
        icon={<TrashIcon />}
        variant="danger"
        label={`Delete ${item.name}`}
        onClick={onDelete}
      />
    </div>
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
