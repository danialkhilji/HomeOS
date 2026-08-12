import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  useShoppingItems,
  useCreateShoppingItem,
  useUpdateShoppingItem,
  useToggleShoppingItem,
  useReorderShoppingItems,
  useDeleteShoppingItem,
} from "../../hooks/useShopping";
import { PageHeader, Button, EmptyState } from "../../components";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import { ShoppingRow } from "./ShoppingList";
import type { ShoppingItem } from "../../types";

export default function ShoppingPage() {
  const { data: items = [] } = useShoppingItems();
  const createItem = useCreateShoppingItem();
  const updateItem = useUpdateShoppingItem();
  const toggleItem = useToggleShoppingItem();
  const reorderItems = useReorderShoppingItems();
  const deleteItem = useDeleteShoppingItem();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  function handleAdd(name: string) {
    createItem.mutate({ name }, {
      onSuccess: () => setAddModalOpen(false),
    });
  }

  function handleEdit(name: string) {
    if (!editingItem) return;
    updateItem.mutate(
      { id: editingItem.id, data: { name } },
      { onSuccess: () => setEditingItem(null) },
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...items];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved!);

    reorderItems.mutate(reordered.map((i) => i.id));
  }

  return (
    <div>
      <PageHeader
        title="Shopping"
        action={<Button onClick={() => setAddModalOpen(true)}>Add Item</Button>}
      />

      {items.length === 0 ? (
        <EmptyState
          message="No items yet. Add your first item."
          action={<Button onClick={() => setAddModalOpen(true)}>Add Item</Button>}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item) => (
                <ShoppingRow
                  key={item.id}
                  item={item}
                  onToggle={() => toggleItem.mutate(item.id)}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => deleteItem.mutate(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <AddItemModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAdd}
      />

      <EditItemModal
        open={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSave={handleEdit}
        currentName={editingItem?.name ?? ""}
      />
    </div>
  );
}
