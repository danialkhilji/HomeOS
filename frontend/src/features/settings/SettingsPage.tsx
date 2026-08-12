import { useState } from "react";
import { motion } from "framer-motion";
import { useThemeStore } from "../../stores/themeStore";
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember } from "../../hooks/useMembers";
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from "../../hooks/useStores";
import { useQuickAddItems, useCreateQuickAddItem, useDeleteQuickAddItem } from "../../hooks/useQuickAdd";
import { PageHeader, Card, Button, EmptyState, IconButton } from "../../components";
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import MemberList from "./MemberList";
import AddStoreModal from "./AddStoreModal";
import EditStoreModal from "./EditStoreModal";
import StoreList from "./StoreList";
import AddQuickAddModal from "./AddQuickAddModal";
import type { Member, Store } from "../../types";

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

  const { data: quickAddItems = [] } = useQuickAddItems();
  const createQuickAdd = useCreateQuickAddItem();
  const deleteQuickAdd = useDeleteQuickAddItem();
  const [addQuickAddOpen, setAddQuickAddOpen] = useState(false);

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

  function handleCreateQuickAdd(name: string, emoji: string) {
    createQuickAdd.mutate({ name, emoji }, {
      onSuccess: () => setAddQuickAddOpen(false),
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

        <Card title="Quick-Add Items">
          {quickAddItems.length === 0 ? (
            <EmptyState
              message="No custom items yet. Using defaults."
              action={<Button onClick={() => setAddQuickAddOpen(true)}>Add Item</Button>}
            />
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {quickAddItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-lg">{item.name}</span>
                    </div>
                    <IconButton
                      icon={<TrashIcon />}
                      variant="danger"
                      label={`Delete ${item.name}`}
                      onClick={() => deleteQuickAdd.mutate(item.id)}
                    />
                  </motion.div>
                ))}
              </div>
              <Button fullWidth onClick={() => setAddQuickAddOpen(true)}>Add Item</Button>
            </div>
          )}
        </Card>
      </div>

      <p className="text-center text-sm text-text-muted dark:text-text-dark-muted mt-8">
        HomeOS v1.2
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

      <AddQuickAddModal
        open={addQuickAddOpen}
        onClose={() => setAddQuickAddOpen(false)}
        onSave={handleCreateQuickAdd}
      />
    </div>
  );
}
