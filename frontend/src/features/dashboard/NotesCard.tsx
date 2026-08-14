import { Card, EmptyState, LoadingSpinner } from "../../components";
import { useNotes } from "../../hooks/useNotes";

export default function NotesCard() {
  const { data: notes = [], isLoading } = useNotes();
  const recent = notes.slice(0, 3);

  return (
    <Card title="Family Notes">
      {isLoading ? (
        <LoadingSpinner />
      ) : recent.length === 0 ? (
        <EmptyState message="No notes yet." />
      ) : (
        <div className="space-y-3">
          {recent.map((note) => (
            <div key={note.id}>
              {note.author && (
                <div className="flex items-center gap-2 mb-0.5">
                  <div
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: note.author.colour }}
                  />
                  <span className="text-sm font-semibold text-text">
                    {note.author.name}
                  </span>
                </div>
              )}
              <p className="text-base text-text-muted line-clamp-2">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
