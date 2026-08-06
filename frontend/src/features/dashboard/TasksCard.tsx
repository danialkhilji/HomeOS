import { Card, EmptyState } from "../../components";

export default function TasksCard() {
  return (
    <Card title="Today's Tasks">
      <EmptyState message="No tasks yet." />
    </Card>
  );
}
