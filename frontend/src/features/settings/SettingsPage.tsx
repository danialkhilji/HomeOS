import { useState } from "react";
import { motion } from "framer-motion";
import { TAP_SPRING } from "../../constants";
import { useMembers, useCreateMember, useUpdateMember, useDeleteMember, useUploadAvatar } from "../../hooks/useMembers";
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from "../../hooks/useStores";
import { useQuickAddItems, useCreateQuickAddItem, useDeleteQuickAddItem } from "../../hooks/useQuickAdd";
import { useBins, useCreateBin, useUpdateBin, useDeleteBin, useBinSettings, useUpdateBinSettings } from "../../hooks/useBins";
import { PageHeader, Card, Button, EmptyState, IconButton, TrashIcon } from "../../components";
import MemberModal from "./MemberModal";
import MemberList from "./MemberList";
import StoreModal from "./StoreModal";
import StoreList from "./StoreList";
import BinModal from "./BinModal";
import BinList from "./BinList";
import AddQuickAddModal from "./AddQuickAddModal";
import { toDateKey, parseLocalDate, addDays, nextCollectionDate, weekLabel, formatShortDate } from "../dashboard/binDates";
import type { CreateBinPayload } from "../../api/bins";
import type { Member, Store, Bin } from "../../types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SettingsPage() {
  const { data: members = [] } = useMembers();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();
  const deleteMember = useDeleteMember();
  const uploadAvatar = useUploadAvatar();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { data: stores = [] } = useStores();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();
  const [addStoreOpen, setAddStoreOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const { data: bins = [] } = useBins();
  const { data: binSettings } = useBinSettings();
  const createBin = useCreateBin();
  const updateBin = useUpdateBin();
  const deleteBin = useDeleteBin();
  const updateBinSettings = useUpdateBinSettings();
  const [addBinOpen, setAddBinOpen] = useState(false);
  const [editingBin, setEditingBin] = useState<Bin | null>(null);

  const nextCollection = binSettings ? nextCollectionDate(binSettings.collection_weekday) : null;
  const currentWeek = binSettings && nextCollection
    ? weekLabel(nextCollection, parseLocalDate(binSettings.week_a_date))
    : null;
  const showWeekToggle = binSettings != null && bins.some((bin) => bin.schedule !== "weekly");

  const { data: quickAddItems = [] } = useQuickAddItems();
  const createQuickAdd = useCreateQuickAddItem();
  const deleteQuickAdd = useDeleteQuickAddItem();
  const [addQuickAddOpen, setAddQuickAddOpen] = useState(false);

  function handleCreateMember(name: string, colour: string, avatar?: File) {
    createMember.mutate({ name, colour }, {
      onSuccess: (member) => {
        if (avatar) {
          uploadAvatar.mutate({ id: member.id, file: avatar });
        }
        setAddMemberOpen(false);
      },
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

  function handleCreateBin(data: CreateBinPayload) {
    createBin.mutate(data, {
      onSuccess: () => setAddBinOpen(false),
    });
  }

  function handleEditBin(data: CreateBinPayload) {
    if (!editingBin) return;
    updateBin.mutate(
      { id: editingBin.id, data },
      { onSuccess: () => setEditingBin(null) },
    );
  }

  // First pick anchors Week A on the next collection; later picks keep week_a_date since labels follow calendar weeks.
  function handleSelectCollectionDay(weekday: number) {
    if (binSettings === undefined || binSettings?.collection_weekday === weekday) return;
    updateBinSettings.mutate({
      collection_weekday: weekday,
      week_a_date: binSettings?.week_a_date ?? toDateKey(nextCollectionDate(weekday)),
    });
  }

  function handleSelectWeek(week: "A" | "B") {
    if (!binSettings || !nextCollection || week === currentWeek) return;
    updateBinSettings.mutate({
      collection_weekday: binSettings.collection_weekday,
      week_a_date: toDateKey(week === "A" ? nextCollection : addDays(nextCollection, -7)),
    });
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

        <Card title="Bin Collection">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-muted">
                Collection day
              </label>
              <div className="flex gap-1.5 sm:gap-2">
                {WEEKDAYS.map((day, index) => {
                  const selected = binSettings?.collection_weekday === index;
                  return (
                    <motion.button
                      key={day}
                      type="button"
                      whileTap={{ scale: 0.9 }}
                      transition={TAP_SPRING}
                      onClick={() => handleSelectCollectionDay(index)}
                      aria-pressed={selected}
                      className={`flex-1 min-w-0 min-h-[48px] rounded-xl border text-base transition-colors ${
                        selected
                          ? "border-primary bg-primary text-white font-semibold"
                          : "border-border text-text-muted"
                      }`}
                    >
                      {day}
                    </motion.button>
                  );
                })}
              </div>
              {binSettings === null && (
                <p className="text-sm text-text-muted mt-2">
                  Choose the day your bins are collected.
                </p>
              )}
            </div>

            {showWeekToggle && nextCollection && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-base text-text">
                  Next collection ({formatShortDate(toDateKey(nextCollection))}) is
                </p>
                <div className="flex gap-2 sm:flex-1">
                  {(["A", "B"] as const).map((week) => (
                    <motion.button
                      key={week}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      transition={TAP_SPRING}
                      onClick={() => handleSelectWeek(week)}
                      aria-pressed={currentWeek === week}
                      className={`flex-1 min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                        currentWeek === week
                          ? "border-primary bg-primary text-white font-semibold"
                          : "border-border text-text-muted"
                      }`}
                    >
                      Week {week}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {bins.length === 0 ? (
              <EmptyState
                message="No bins yet. Add your first bin."
                action={<Button onClick={() => setAddBinOpen(true)}>Add Bin</Button>}
              />
            ) : (
              <div className="space-y-4">
                <BinList
                  bins={bins}
                  onEdit={(bin) => setEditingBin(bin)}
                  onDelete={(id) => deleteBin.mutate(id)}
                />
                <Button fullWidth onClick={() => setAddBinOpen(true)}>Add Bin</Button>
              </div>
            )}
          </div>
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
                    transition={TAP_SPRING}
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

      <p className="text-center text-sm text-text-muted mt-8">
        HomeOS v1.5
      </p>

      <MemberModal
        open={addMemberOpen || editingMember !== null}
        member={editingMember}
        onClose={() => { setAddMemberOpen(false); setEditingMember(null); }}
        onSave={editingMember ? handleEditMember : handleCreateMember}
      />

      <StoreModal
        open={addStoreOpen || editingStore !== null}
        store={editingStore}
        onClose={() => { setAddStoreOpen(false); setEditingStore(null); }}
        onSave={editingStore ? handleEditStore : handleCreateStore}
      />

      <BinModal
        open={addBinOpen || editingBin !== null}
        bin={editingBin}
        onClose={() => { setAddBinOpen(false); setEditingBin(null); }}
        onSave={editingBin ? handleEditBin : handleCreateBin}
      />

      <AddQuickAddModal
        open={addQuickAddOpen}
        onClose={() => setAddQuickAddOpen(false)}
        onSave={handleCreateQuickAdd}
      />
    </div>
  );
}
