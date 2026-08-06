import { PageHeader, Button, EmptyState } from "../../components";

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Tasks"
        action={<Button onClick={() => {}}>Add Task</Button>}
      />
      <EmptyState
        message="No tasks yet. Add your first task."
      />
    </div>
  );
}
