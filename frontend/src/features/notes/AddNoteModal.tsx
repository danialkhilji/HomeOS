import { useState } from "react";
import { Modal, Button } from "../../components";
import { useMembers } from "../../hooks/useMembers";

interface AddNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (content: string, authorId: number | null) => void;
}

export default function AddNoteModal({ open, onClose, onSave }: AddNoteModalProps) {
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState<number | null>(null);
  const { data: members = [] } = useMembers();

  function handleSave() {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSave(trimmed, authorId);
    setContent("");
    setAuthorId(null);
  }

  function handleClose() {
    setContent("");
    setAuthorId(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Note">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            From
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAuthorId(null)}
              className={`min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                authorId === null
                  ? "border-primary bg-primary/10 text-primary font-semibold"
                  : "border-border text-text-muted dark:border-border-dark dark:text-text-dark-muted"
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
                    : "border-border text-text-muted dark:border-border-dark dark:text-text-dark-muted"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0"
                  style={{ backgroundColor: member.colour }}
                />
                {member.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a note..."
            rows={4}
            className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-border bg-surface text-text text-lg resize-none dark:border-border-dark dark:bg-surface-dark-dim dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
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
