import { useState, useEffect, useRef } from "react";
import { Modal, Button } from "../../components";
import { PRESET_COLOURS } from "../../constants";
import { useUploadAvatar, useDeleteAvatar } from "../../hooks/useMembers";
import type { Member } from "../../types";

interface EditMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, colour: string) => void;
  member: Member | null;
}

export default function EditMemberModal({ open, onClose, onSave, member }: EditMemberModalProps) {
  const [name, setName] = useState("");
  const [colour, setColour] = useState(PRESET_COLOURS[0]!);
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();

  useEffect(() => {
    if (member) {
      setName(member.name);
      setColour(member.colour);
      setPreview(member.avatar_url);
      setPendingFile(null);
    }
  }, [member]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemoveAvatar() {
    setPreview(null);
    setPendingFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed || !member) return;
    onSave(trimmed, colour);

    if (pendingFile) {
      uploadAvatar.mutate({ id: member.id, file: pendingFile });
    } else if (!preview && member.avatar_url) {
      deleteAvatar.mutate(member.id);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Member">
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-3">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full border-2 border-border"
              style={{ backgroundColor: colour }}
            />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-sm text-primary font-semibold active:text-primary-dark transition-colors"
            >
              {preview ? "Change Photo" : "Add Photo"}
            </button>
            {preview && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-sm text-danger font-semibold active:text-danger/70 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Colour
          </label>
          <div className="flex gap-3 flex-wrap">
            {PRESET_COLOURS.map((c) => (
              <button
                key={c}
                onClick={() => setColour(c)}
                className={`w-12 h-12 rounded-full transition-transform ${
                  colour === c ? "ring-3 ring-offset-2 ring-primary scale-110" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleSave} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}