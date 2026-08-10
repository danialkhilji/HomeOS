import { useState } from "react";
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "../../hooks/useNotes";
import { PageHeader, Button, EmptyState } from "../../components";
import AddNoteModal from "./AddNoteModal";
import EditNoteModal from "./EditNoteModal";
import NoteList from "./NoteList";
import type { Note } from "../../types";

export default function NotesPage() {
  const { data: notes = [] } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  function handleCreate(content: string, authorId: number | null) {
    createNote.mutate(
      { content, author_id: authorId },
      { onSuccess: () => setAddModalOpen(false) },
    );
  }

  function handleEdit(content: string) {
    if (!editingNote) return;
    updateNote.mutate(
      { id: editingNote.id, data: { content } },
      { onSuccess: () => setEditingNote(null) },
    );
  }

  return (
    <div>
      <PageHeader
        title="Notes"
        action={<Button onClick={() => setAddModalOpen(true)}>Add Note</Button>}
      />

      {notes.length === 0 ? (
        <EmptyState
          message="No notes yet. Add your first note."
          action={<Button onClick={() => setAddModalOpen(true)}>Add Note</Button>}
        />
      ) : (
        <NoteList
          notes={notes}
          onEdit={(note) => setEditingNote(note)}
          onDelete={(id) => deleteNote.mutate(id)}
        />
      )}

      <AddNoteModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleCreate}
      />

      <EditNoteModal
        open={editingNote !== null}
        onClose={() => setEditingNote(null)}
        onSave={handleEdit}
        currentContent={editingNote?.content ?? ""}
      />
    </div>
  );
}