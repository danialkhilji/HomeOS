import { useState } from "react";
import { useThemeStore } from "../../stores/themeStore";
import { useMembers, useCreateMember, useDeleteMember } from "../../hooks/useMembers";
import { PageHeader, Card, Button, EmptyState } from "../../components";
import AddMemberModal from "./AddMemberModal";
import MemberList from "./MemberList";

export default function SettingsPage() {
  const { theme, toggle } = useThemeStore();
  const { data: members = [] } = useMembers();
  const createMember = useCreateMember();
  const deleteMember = useDeleteMember();
  const [modalOpen, setModalOpen] = useState(false);

  function handleSave(name: string, colour: string) {
    createMember.mutate({ name, colour }, {
      onSuccess: () => setModalOpen(false),
    });
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
              action={<Button onClick={() => setModalOpen(true)}>Add Member</Button>}
            />
          ) : (
            <div className="space-y-4">
              <MemberList
                members={members}
                onDelete={(id) => deleteMember.mutate(id)}
              />
              <Button fullWidth onClick={() => setModalOpen(true)}>Add Member</Button>
            </div>
          )}
        </Card>
      </div>

      <AddMemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
