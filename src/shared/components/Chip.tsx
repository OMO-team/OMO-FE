import { twMerge } from "tailwind-merge";

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
      ? "bg-primary-800 text-white rounded-full"
      : "bg-white text-gray-700 rounded-2";

  if (onRemove) {
    return (
      <span
        className={twMerge(`flex justify-center items-center gap-2 px-3 py-1.5 body-03 ${variantClass}`, className)}
      >
        {label}
        <button type="button" onClick={onRemove} aria-label="닫기" className="flex shrink-0 items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 3L3 13M3 3L13 13" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </span>
    );
  }
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={twMerge(`flex justify-center items-center gap-1 px-3 py-1.5 ${variantClass} body-03`, className)}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      className={twMerge(`flex justify-center items-center gap-1 px-3 py-1.5 ${variantClass} body-03`, className)}
    >
      {label}
    </div>
  );
}
