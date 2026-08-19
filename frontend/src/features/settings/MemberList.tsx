import { motion } from "framer-motion";
import { IconButton, TrashIcon } from "../../components";
import { useLongPress } from "../../hooks/useLongPress";
import type { Member } from "../../types";

interface MemberListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: number) => void;
}

function MemberRow({ member, onEdit, onDelete }: { member: Member; onEdit: () => void; onDelete: () => void }) {
  const longPress = useLongPress(onEdit);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
    </motion.div>
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
