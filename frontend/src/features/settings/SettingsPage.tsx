import { useState } from "react";
import { useThemeStore } from "../../stores/themeStore";
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from "../../hooks/useMembers";
import { PageHeader, Card, Button, EmptyState } from "../../components";
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import MemberList from "./MemberList";
import type { Member } from "../../types";

export default function SettingsPage() {
  const { theme, toggle } = useThemeStore();
  const { data: members = [] } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  function handleCreate(name: string, colour: string) {
    createMember.mutate({ name, colour }, {
      onSuccess: () => setAddModalOpen(false),
    });
  }

  function handleEdit(name: string, colour: string) {
    if (!editingMember) return;
    updateMember.mutate(
      { id: editingMember.id, data: { name, colour } },
      { onSuccess: () => setEditingMember(null) },
    );
  }

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="space-y-4">
        <Card title="Appearance">
          <div className="flex items-center justify-between">
            <span className="text-lg">Dark Mode</span>
            <Button onClick={toggle}>
              {theme === "dark" ? "On" : "Off"}
            </Button>
          </div>
        </Card>

        <Card title="Household Members">
          {members.length === 0 ? (
            <EmptyState
              message="No members yet. Add your first member."
              action={<Button onClick={() => setAddModalOpen(true)}>Add Member</Button>}
            />
          ) : (
            <div className="space-y-4">
              <MemberList
                members={members}
                onEdit={(member) => setEditingMember(member)}
                onDelete={(id) => deleteMember.mutate(id)}
              />
              <Button fullWidth onClick={() => setAddModalOpen(true)}>Add Member</Button>
            </div>
          )}
        </Card>
      </div>

      <AddMemberModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleCreate}
      />

      <EditMemberModal
        open={editingMember !== null}
        onClose={() => setEditingMember(null)}
        onSave={handleEdit}
        member={editingMember}
      />
    </div>
  );
}