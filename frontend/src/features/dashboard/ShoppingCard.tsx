import { useMemo } from "react";
import { Card, EmptyState, LoadingSpinner } from "../../components";
import { useShoppingItems, useToggleShoppingItem } from "../../hooks/useShopping";

export default function ShoppingCard() {
  const { data: items = [], isLoading } = useShoppingItems();
  const toggleItem = useToggleShoppingItem();
  const unpurchased = items.filter((item) => !item.is_purchased);
  const hasStores = items.some((item) => item.store_id !== null);

  const storeCounts = useMemo(() => {
    if (!hasStores) return [];

    const counts = new Map<string, { name: string; colour: string | null; count: number }>();

    for (const item of unpurchased) {
      const key = item.store_id !== null ? String(item.store_id) : "any";
      const existing = counts.get(key);
      if (existing) {
        existing.count++;
      } else {
        counts.set(key, {
          name: item.store?.name ?? "Any Store",
          colour: item.store?.colour ?? null,
          count: 1,
        });
      }
    }

    const result = [];
    const anyStore = counts.get("any");
    if (anyStore) result.push(anyStore);
    for (const [key, group] of counts) {
      if (key !== "any") result.push(group);
    }
    return result;
  }, [unpurchased, hasStores]);

  return (
    <Card
      title={
        unpurchased.length > 0
          ? `Shopping List — ${unpurchased.length} item${unpurchased.length === 1 ? "" : "s"}`
          : "Shopping List"
      }
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState message="No items yet." />
      ) : unpurchased.length === 0 ? (
        <p className="text-center text-text-muted py-4">All items purchased!</p>
      ) : hasStores ? (
        <div className="space-y-2">
          {storeCounts.map((group) => (
            <div key={group.name} className="flex items-center gap-3 py-1.5">
              {group.colour ? (
                <div
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: group.colour }}
                />
              ) : (
                <div className="w-4 h-4 shrink-0" />
              )}
              <span className="text-base text-text">
                {group.name} — {group.count} item{group.count === 1 ? "" : "s"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {unpurchased.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem.mutate(item.id)}
              className="flex items-center gap-3 py-1.5 cursor-pointer"
            >
              <div className="w-5 h-5 rounded border-2 border-border shrink-0" />
              <span className="text-base text-text">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}