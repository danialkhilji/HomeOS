import { Card, EmptyState, LoadingSpinner, MemberDot } from "../../components";
import { useNotes } from "../../hooks/useNotes";

export default function NotesCard() {
  const { data: notes = [], isLoading } = useNotes();
  const recent = notes.slice(0, 3);

  return (
    <Card title="Notes">
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
                  <MemberDot avatarUrl={note.author.avatar_url} colour={note.author.colour} name={note.author.name} size={30} />
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
