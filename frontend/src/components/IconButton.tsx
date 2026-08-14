import { motion } from "framer-motion";

type IconButtonVariant = "default" | "danger";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: IconButtonVariant;
  label?: string;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default:
    "text-text-muted active:bg-surface-dim",
  danger: "text-danger active:bg-red-100",
};

export default function IconButton({
  icon,
  onClick,
  variant = "default",
  label,
}: IconButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label={label}
      className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${variantStyles[variant]}`}
    >
      {icon}
    </motion.button>
  );
}
