import { motion } from "framer-motion";
import { TAP_SPRING } from "../constants";

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
    "bg-accent-pale border border-border text-primary active:bg-primary-light",
  danger: "bg-danger text-white active:brightness-90",
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
      whileTap={{ scale: 0.8 }}
      transition={TAP_SPRING}
      className={`min-h-[48px] px-6 rounded-xl font-semibold text-base transition-colors ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      {children}
    </motion.button>
  );
}
