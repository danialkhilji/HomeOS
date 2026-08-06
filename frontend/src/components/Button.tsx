import { motion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white active:bg-primary-dark",
  secondary:
    "bg-transparent border border-border text-text active:bg-surface-dim dark:border-border-dark dark:text-text-dark dark:active:bg-surface-dark-dim",
  danger: "bg-danger text-white active:bg-red-700",
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  type = "button",
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`min-h-[48px] px-6 rounded-xl font-semibold text-base transition-colors ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      {children}
    </motion.button>
  );
}
