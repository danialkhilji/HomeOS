import { PageHeader, Button, EmptyState } from "../../components";

export default function NotesPage() {
  return (
    <div>
      <PageHeader
        title="Notes"
        action={<Button onClick={() => {}}>Add Note</Button>}
      />
      <EmptyState
        message="No notes yet. Add your first note."
      />
    </div>
  );
}
