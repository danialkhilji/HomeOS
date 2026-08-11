import { Card, EmptyState, LoadingSpinner } from "../../components";
import { useShoppingItems, useToggleShoppingItem } from "../../hooks/useShopping";

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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
      ) : items.length === 0 ? (
        <EmptyState message="No items yet." />
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem.mutate(item.id)}
              className="flex items-center gap-3 py-1.5 cursor-pointer"
            >
              <div
                className={`flex items-center justify-center w-5 h-5 rounded shrink-0 ${
                  item.is_purchased
                    ? "bg-success text-white"
                    : "border-2 border-border dark:border-border-dark"
                }`}
              >
                {item.is_purchased && <CheckIcon />}
              </div>
              <span
                className={`text-base ${
                  item.is_purchased
                    ? "line-through text-text-muted dark:text-text-dark-muted"
                    : "text-text dark:text-text-dark"
                }`}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}