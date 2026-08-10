import { useState, useEffect } from "react";
import { Modal, Button } from "../../components";

interface EditNoteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  currentContent: string;
}

export default function EditNoteModal({ open, onClose, onSave, currentContent }: EditNoteModalProps) {
  const [content, setContent] = useState(currentContent);

  useEffect(() => {
    setContent(currentContent);
  }, [currentContent]);

  function handleSave() {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSave(trimmed);
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Note">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted dark:text-text-dark-muted">
            Message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            autoFocus
            rows={4}
            className="w-full min-h-[120px] px-4 py-3 rounded-xl border border-border bg-surface text-text text-lg resize-none dark:border-border-dark dark:bg-surface-dark-dim dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
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