import { PageHeader, Button, EmptyState } from "../../components";

export default function ShoppingPage() {
  return (
    <div>
      <PageHeader
        title="Shopping"
        action={<Button onClick={() => {}}>Add Item</Button>}
      />
      <EmptyState
        message="No items yet. Add your first item."
      />
    </div>
  );
}
