import { IconButton } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import type { Member } from "../../types";

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
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

function MemberRow({ member, onEdit, onDelete }: { member: Member; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);

  return (
    <div
      className="flex items-center justify-between py-2"
      {...longPress}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full shrink-0"
          style={{ backgroundColor: member.colour }}
        />
        <span className="text-lg">{member.name}</span>
      </div>
      <IconButton
        icon={<TrashIcon />}
        variant="danger"
        label={`Delete ${member.name}`}
        onClick={onDelete}
      />
    </div>
  );
}

export default function MemberList({ members, onEdit, onDelete }: MemberListProps) {
  return (
    <div className="space-y-2">
      {members.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          onEdit={() => onEdit(member)}
          onDelete={() => onDelete(member.id)}
        />
      ))}
    </div>
  );
}
