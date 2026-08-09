import { useState } from "react";
import {
  useShoppingItems,
  useCreateShoppingItem,
  useUpdateShoppingItem,
  useToggleShoppingItem,
  useDeleteShoppingItem,
} from "../../hooks/useShopping";
import { PageHeader, Button, EmptyState } from "../../components";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import ShoppingList from "./ShoppingList";
import type { ShoppingItem } from "../../types";

export default function ShoppingPage() {
  const { data: items = [] } = useShoppingItems();
  const createItem = useCreateShoppingItem();
  const updateItem = useUpdateShoppingItem();
  const toggleItem = useToggleShoppingItem();
  const deleteItem = useDeleteShoppingItem();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

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
        <ShoppingList
          items={items}
          onToggle={(id) => toggleItem.mutate(id)}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(id) => deleteItem.mutate(id)}
        />
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
