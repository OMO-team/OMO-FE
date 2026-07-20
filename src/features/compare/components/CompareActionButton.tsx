type CompareActionButtonVariant = "primary" | "dark";

interface CompareActionButtonProps {
  label: string;
  variant?: CompareActionButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const VARIANT_CLASS: Record<CompareActionButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white disabled:bg-gray-300 disabled:text-gray-500",
  dark: "bg-black text-white disabled:bg-gray-700 disabled:text-gray-400",
};

export default function CompareActionButton({
  label,
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
}: CompareActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`title-03 rounded-full px-5 py-2 transition-colors disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${className}`}
    >
      {label}
    </button>
  );
}
