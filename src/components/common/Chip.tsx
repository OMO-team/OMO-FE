import CloseButton from "./CloseButton";

interface ChipProps {
  label: string;
  variant?: "light" | "dark";
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export default function Chip({
  label,
  variant = "light",
  onClick,
  onRemove,
  className = "",
}: ChipProps) {
  const variantClass =
    variant === "dark"
      ? "bg-gray-800 text-white rounded-full"
      : "bg-white text-gray-700 rounded-2";

  if (onRemove) {
    return (
      <span
        className={`flex justify-center items-center gap-1.5 px-3 py-1.5 body-03 ${variantClass} ${className}`}
      >
        {label}
        <CloseButton onClick={onRemove} hasBackground={false} />
      </span>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex justify-center items-center gap-1 px-3 py-1.5 ${variantClass} body-03 ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      className={`flex justify-center items-center gap-1 px-3 py-1.5 ${variantClass} body-03 ${className}`}
    >
      {label}
    </div>
  );
}
