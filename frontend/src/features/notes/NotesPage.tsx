import { useState } from "react";
import { useNotes, useCreateNote, useDeleteNote } from "../../hooks/useNotes";
import { PageHeader, Button, EmptyState } from "../../components";
import AddNoteModal from "./AddNoteModal";
import NoteList from "./NoteList";

export default function NotesPage() {
  const { data: notes = [] } = useNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const [modalOpen, setModalOpen] = useState(false);

  function handleSave(content: string, authorId: number | null) {
    createNote.mutate(
      { content, author_id: authorId },
      { onSuccess: () => setModalOpen(false) },
    );
  }

  return (
    <div>
      <PageHeader
        title="Notes"
        action={<Button onClick={() => setModalOpen(true)}>Add Note</Button>}
      />

      {notes.length === 0 ? (
        <EmptyState
          message="No notes yet. Add your first note."
          action={<Button onClick={() => setModalOpen(true)}>Add Note</Button>}
        />
      ) : (
        <NoteList
          notes={notes}
          onDelete={(id) => deleteNote.mutate(id)}
        />
      )}

      <AddNoteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
