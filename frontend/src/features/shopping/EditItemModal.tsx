import { useState, useEffect } from "react";
import { Modal, Button } from "../../components";
import { useStores } from "../../hooks/useStores";
import type { ShoppingItem } from "../../types";

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, storeId: number | null) => void;
  item: ShoppingItem | null;
}

export default function EditItemModal({ open, onClose, onSave, item }: EditItemModalProps) {
  const [name, setName] = useState("");
  const [storeId, setStoreId] = useState<number | null>(null);
  const { data: stores = [] } = useStores();

  useEffect(() => {
    if (item) {
      setName(item.name);
      setStoreId(item.store_id);
    }
  }, [item]);

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed, storeId);
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Item">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-muted">
            Item
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full min-h-[48px] px-4 rounded-xl border border-border bg-surface text-text text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {stores.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-text-muted">
              Store
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStoreId(null)}
                className={`min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                  storeId === null
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-border text-text-muted"
                }`}
              >
                Any Store
              </button>
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setStoreId(store.id)}
                  className={`flex items-center gap-2 min-h-[48px] px-4 rounded-xl border text-base transition-colors ${
                    storeId === store.id
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border text-text-muted"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0"
                    style={{ backgroundColor: store.colour }}
                  />
                  {store.name}
                </button>
              ))}
            </div>
          </div>
        )}

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
