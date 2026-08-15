import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
}

export default function Card({ children, title, onClick }: CardProps) {
  const card = (
    <div className="rounded-2xl p-4 bg-white border border-border shadow-sm">
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-text">
          {title}
        </h3>
      )}
      {children}
    </div>
  );

  if (onClick) {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        onClick={onClick}
        className="cursor-pointer"
      >
        {card}
      </motion.div>
    );
  }

  return card;
}
