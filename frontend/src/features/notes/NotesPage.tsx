import { useState } from "react";
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from "../../hooks/useNotes";
import { PageHeader, Button, EmptyState } from "../../components";
import NoteModal from "./NoteModal";
import NoteList from "./NoteList";
import type { Note } from "../../types";

export default function NotesPage() {
  const { data: notes = [] } = useNotes();
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalNote, setModalNote] = useState<Note | null>(null);

  function handleOpenAdd() {
    setModalNote(null);
    setModalOpen(true);
  }

  function handleOpenEdit(note: Note) {
    setModalNote(note);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setModalNote(null);
  }

  function handleSave(content: string, authorId: number | null) {
    if (modalNote) {
      updateNote.mutate(
        { id: modalNote.id, data: { content } },
        { onSuccess: handleCloseModal },
      );
    } else {
      createNote.mutate(
        { content, author_id: authorId },
        { onSuccess: handleCloseModal },
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="Notes"
        action={<Button onClick={handleOpenAdd}>Add Note</Button>}
      />

      {notes.length === 0 ? (
        <EmptyState
          message="No notes yet. Add your first note."
          action={<Button onClick={handleOpenAdd}>Add Note</Button>}
        />
      ) : (
        <NoteList
          notes={notes}
          onEdit={handleOpenEdit}
          onDelete={(id) => deleteNote.mutate(id)}
        />
      )}

      <NoteModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        note={modalNote}
      />
    </div>
  );
}