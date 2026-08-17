import { useState, useMemo } from "react";
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
import QuickAddBar from "./QuickAddBar";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import { ShoppingRow } from "./ShoppingList";
import type { ShoppingItem } from "../../types";

interface StoreGroup {
  storeId: number | null;
  storeName: string;
  storeColour: string | null;
  items: ShoppingItem[];
}

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

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const activeItems = useMemo(() => items.filter((i) => !i.is_purchased), [items]);
  const recentlyPurchased = useMemo(() => items.filter((i) =>
    i.is_purchased && i.purchased_at && (now - new Date(i.purchased_at).getTime()) < DAY_MS
  ), [items, now]);
  const olderPurchasedCount = useMemo(() => items.filter((i) =>
    i.is_purchased && (!i.purchased_at || (now - new Date(i.purchased_at).getTime()) >= DAY_MS)
  ).length, [items, now]);

  const groups = useMemo(() => {
    const groupMap = new Map<number | null, StoreGroup>();

    groupMap.set(null, {
      storeId: null,
      storeName: "Any Store",
      storeColour: null,
      items: [],
    });

    for (const item of activeItems) {
      const key = item.store_id;
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          storeId: key,
          storeName: item.store?.name ?? "Any Store",
          storeColour: item.store?.colour ?? null,
          items: [],
        });
      }
      groupMap.get(key)!.items.push(item);
    }

    const result: StoreGroup[] = [];
    const anyStore = groupMap.get(null)!;
    if (anyStore.items.length > 0) {
      result.push(anyStore);
    }
    for (const [key, group] of groupMap) {
      if (key !== null && group.items.length > 0) {
        result.push(group);
      }
    }
    return result;
  }, [activeItems]);

  function handleAdd(name: string, storeId: number | null) {
    createItem.mutate({ name, store_id: storeId }, {
      onSuccess: () => setAddModalOpen(false),
    });
  }

  function handleEdit(name: string, storeId: number | null) {
    if (!editingItem) return;
    updateItem.mutate(
      { id: editingItem.id, data: { name, store_id: storeId } },
      { onSuccess: () => setEditingItem(null) },
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeItems.findIndex((i) => i.id === active.id);
    const newIndex = activeItems.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...activeItems];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved!);

    reorderItems.mutate(reordered.map((i) => i.id));
  }

  const hasStores = groups.length > 1 || (groups.length === 1 && groups[0]!.storeId !== null);
  const existingNames = items.map((i) => i.name);

  function handleQuickAdd(name: string) {
    createItem.mutate({ name });
  }

  return (
    <div>
      <PageHeader
        title="Shopping"
        action={<Button onClick={() => setAddModalOpen(true)}>Add Item</Button>}
      />

      <QuickAddBar onAdd={handleQuickAdd} existingItems={existingNames} />

      {items.length === 0 ? (
        <EmptyState
          message="No items yet. Tap an item above or add your own."
          action={<Button onClick={() => setAddModalOpen(true)}>Add Item</Button>}
        />
      ) : (
        <>
          {activeItems.length === 0 ? (
            <p className="text-center text-text-muted py-8">All items purchased!</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={activeItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                {hasStores ? (
                  <div className="space-y-6">
                    {groups.map((group) => (
                      <div key={group.storeId ?? "any"}>
                        <div className="flex items-center gap-2 mb-2">
                          {group.storeColour && (
                            <div
                              className="w-4 h-4 rounded-full shrink-0"
                              style={{ backgroundColor: group.storeColour }}
                            />
                          )}
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                            {group.storeName}
                          </h3>
                        </div>
                        <div className="space-y-2">
                          {group.items.map((item) => (
                            <ShoppingRow
                              key={item.id}
                              item={item}
                              onToggle={() => toggleItem.mutate(item.id)}
                              onEdit={() => setEditingItem(item)}
                              onDelete={() => deleteItem.mutate(item.id)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeItems.map((item) => (
                      <ShoppingRow
                        key={item.id}
                        item={item}
                        onToggle={() => toggleItem.mutate(item.id)}
                        onEdit={() => setEditingItem(item)}
                        onDelete={() => deleteItem.mutate(item.id)}
                      />
                    ))}
                  </div>
                )}
              </SortableContext>
            </DndContext>
          )}

          {recentlyPurchased.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              {recentlyPurchased.map((item) => (
                <ShoppingRow
                  key={item.id}
                  item={item}
                  onToggle={() => toggleItem.mutate(item.id)}
                  onEdit={() => setEditingItem(item)}
                  onDelete={() => deleteItem.mutate(item.id)}
                />
              ))}
            </div>
          )}

          {olderPurchasedCount > 0 && (
            <p className="text-sm text-text-muted mt-4">
              {olderPurchasedCount} older item{olderPurchasedCount === 1 ? "" : "s"} purchased
            </p>
          )}
        </>
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
        item={editingItem}
      />
    </div>
  );
}