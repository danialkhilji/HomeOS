import { IconButton } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import type { Note } from "../../types";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function NoteCard({ note, onEdit, onDelete }: { note: Note; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);

  return (
    <div
      className="rounded-xl p-4 bg-white border border-border dark:bg-surface-dark-dim dark:border-border-dark"
      {...longPress}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {note.author && (
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-5 h-5 rounded-full shrink-0"
                style={{ backgroundColor: note.author.colour }}
              />
              <span className="text-sm font-semibold text-text dark:text-text-dark">
                {note.author.name}
              </span>
            </div>
          )}
          <p className="text-base text-text dark:text-text-dark whitespace-pre-wrap">
            {note.content}
          </p>
        </div>

        <IconButton
          icon={<TrashIcon />}
          variant="danger"
          label="Delete note"
          onClick={onDelete}
        />
      </div>
    </div>
  );
}

export default function NoteList({ notes, onEdit, onDelete }: NoteListProps) {
  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={() => onEdit(note)}
          onDelete={() => onDelete(note.id)}
        />
      ))}
    </div>
  );
}