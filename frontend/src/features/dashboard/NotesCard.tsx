import { Card, EmptyState } from "../../components";

export default function NotesCard() {
  return (
    <Card title="Family Notes">
      <EmptyState message="No notes yet." />
    </Card>
  );
}
