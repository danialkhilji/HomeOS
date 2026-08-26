import { useState, useEffect } from "react";
import { Modal, Button, MemberDot } from "../../components";
import { useMembers } from "../../hooks/useMembers";
import type { Note } from "../../types";

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (content: string, authorId: number | null) => void;
  note?: Note | null;
}

export default function NoteModal({ open, onClose, onSave, note = null }: NoteModalProps) {
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState<number | null>(null);
  const { data: members = [] } = useMembers();

  const isEditMode = note !== null;

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setAuthorId(note.author_id);
    } else {
      setContent("");
      setAuthorId(null);
    }
  }, [note]);

  function handleSave() {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSave(trimmed, authorId);
    if (!isEditMode) {
      setContent("");
      setAuthorId(null);
    }
  }

  function handleClose() {
    if (!isEditMode) {
      setContent("");
      setAuthorId(null);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={isEditMode ? "Edit Note" : "Add Note"}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            From
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAuthorId(null)}
              className={`min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                authorId === null
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border text-text-muted"
              }`}
            >
              Anonymous
            </button>
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setAuthorId(member.id)}
                className={`flex items-center gap-2 min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                  authorId === member.id
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border text-text-muted"
                }`}
              >
                <MemberDot avatarUrl={member.avatar_url} colour={member.colour} name={member.name} size={30} />
                {member.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a note..."
            rows={4}
            autoFocus={isEditMode}
            className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-border bg-surface text-text text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={handleClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave} disabled={!content.trim()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
