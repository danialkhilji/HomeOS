import { motion } from "framer-motion";

const PRESET_ITEMS = [
  { emoji: "🥛", name: "Milk" },
  { emoji: "🥚", name: "Eggs" },
  { emoji: "🍞", name: "Bread" },
  { emoji: "🍌", name: "Banana" },
  { emoji: "🍎", name: "Apple" },
  { emoji: "🍚", name: "Rice" },
  { emoji: "🥔", name: "Potato" },
  { emoji: "🧅", name: "Onion" },
  { emoji: "🍅", name: "Tomato" },
  { emoji: "🍇", name: "Grapes" },
  { emoji: "🥣", name: "Yoghurt" },
];

interface QuickAddBarProps {
  onAdd: (name: string) => void;
  existingItems: string[];
}

export default function QuickAddBar({ onAdd, existingItems }: QuickAddBarProps) {
  const existingLower = existingItems.map((n) => n.toLowerCase());

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {PRESET_ITEMS.map((item) => {
        const exists = existingLower.includes(item.name.toLowerCase());

        return (
          <motion.button
            key={item.name}
            whileTap={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            onClick={() => {
              if (!exists) onAdd(item.name);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-colors ${
              exists
                ? "opacity-30 border-border dark:border-border-dark"
                : "border-border bg-white dark:border-border-dark dark:bg-surface-dark-dim active:bg-surface-dim dark:active:bg-surface-dark"
            }`}
          >
            <span className="text-lg">{item.emoji}</span>
            <span className="text-text dark:text-text-dark">{item.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
