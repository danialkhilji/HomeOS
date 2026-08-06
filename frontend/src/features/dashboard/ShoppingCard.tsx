import { Card, EmptyState } from "../../components";

export default function ShoppingCard() {
  return (
    <Card title="Shopping List">
      <EmptyState message="No items yet." />
    </Card>
  );
}
