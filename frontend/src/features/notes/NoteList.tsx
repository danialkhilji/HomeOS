import { motion } from "framer-motion";
import { IconButton, TrashIcon } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import type { Note } from "../../types";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
}

function NoteCard({ note, onEdit, onDelete }: { note: Note; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="rounded-xl p-4 bg-white border border-border"
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
              <span className="text-sm font-semibold text-text">
                {note.author.name}
              </span>
            </div>
          )}
          <p className="text-base text-text whitespace-pre-wrap">
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
    </motion.div>
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