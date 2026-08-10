import { Card, EmptyState, LoadingSpinner } from "../../components";
import { useShoppingItems, useToggleShoppingItem } from "../../hooks/useShopping";

export default function ShoppingCard() {
  const { data: items = [], isLoading } = useShoppingItems();
  const toggleItem = useToggleShoppingItem();
  const unpurchased = items.filter((item) => !item.is_purchased);

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
      ) : unpurchased.length === 0 ? (
        <EmptyState message="No items yet." />
      ) : (
        <div className="space-y-2">
          {unpurchased.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem.mutate(item.id)}
              className="flex items-center gap-3 py-1.5 cursor-pointer"
            >
              <div className="w-5 h-5 rounded border-2 border-border dark:border-border-dark shrink-0" />
              <span className="text-base text-text dark:text-text-dark">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}