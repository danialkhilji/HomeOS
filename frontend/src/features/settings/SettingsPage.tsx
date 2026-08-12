import { useState } from "react";
import { useThemeStore } from "../../stores/themeStore";
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from "../../hooks/useMembers";
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from "../../hooks/useStores";
import { PageHeader, Card, Button, EmptyState } from "../../components";
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import MemberList from "./MemberList";
import AddStoreModal from "./AddStoreModal";
import EditStoreModal from "./EditStoreModal";
import StoreList from "./StoreList";
import type { Member, Store } from "../../types";

export default function SettingsPage() {
  const { theme, toggle } = useThemeStore();

  const { data: members = [] } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { data: stores = [] } = useStores();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  function handleCreateMember(name: string, colour: string) {
    createMember.mutate({ name, colour }, {
      onSuccess: () => setAddMemberOpen(false),
    });
  }

  function handleEditMember(name: string, colour: string) {
    if (!editingMember) return;
    updateMember.mutate(
      { id: editingMember.id, data: { name, colour } },
      { onSuccess: () => setEditingMember(null) },
    );
  }

  function handleCreateStore(name: string, colour: string) {
    createStore.mutate({ name, colour }, {
      onSuccess: () => setAddStoreOpen(false),
    });
  }

  function handleEditStore(name: string, colour: string) {
    if (!editingStore) return;
    updateStore.mutate(
      { id: editingStore.id, data: { name, colour } },
      { onSuccess: () => setEditingStore(null) },
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
              action={<Button onClick={() => setAddMemberOpen(true)}>Add Member</Button>}
            />
          ) : (
            <div className="space-y-4">
              <MemberList
                members={members}
                onEdit={(member) => setEditingMember(member)}
                onDelete={(id) => deleteMember.mutate(id)}
              />
              <Button fullWidth onClick={() => setAddMemberOpen(true)}>Add Member</Button>
            </div>
          )}
        </Card>

        <Card title="Stores">
          {stores.length === 0 ? (
            <EmptyState
              message="No stores yet. Add your first store."
              action={<Button onClick={() => setAddStoreOpen(true)}>Add Store</Button>}
            />
          ) : (
            <div className="space-y-4">
              <StoreList
                stores={stores}
                onEdit={(store) => setEditingStore(store)}
                onDelete={(id) => deleteStore.mutate(id)}
              />
              <Button fullWidth onClick={() => setAddStoreOpen(true)}>Add Store</Button>
            </div>
          )}
        </Card>
      </div>

      <p className="text-center text-sm text-text-muted dark:text-text-dark-muted mt-8">
        HomeOS v1.1
      </p>

      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        onSave={handleCreateMember}
      />

      <EditMemberModal
        open={editingMember !== null}
        onClose={() => setEditingMember(null)}
        onSave={handleEditMember}
        member={editingMember}
      />

      <AddStoreModal
        open={addStoreOpen}
        onClose={() => setAddStoreOpen(false)}
        onSave={handleCreateStore}
      />

      <EditStoreModal
        open={editingStore !== null}
        onClose={() => setEditingStore(null)}
        onSave={handleEditStore}
        store={editingStore}
      />
    </div>
  );
}
