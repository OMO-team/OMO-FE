type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

interface CloseButtonProps {
  onClick: () => void;
  iconSize?: IconSize;
  hasBackground?: boolean;
  className?: string;
}

const ICON_SIZE_CLASS: Record<IconSize, string> = {
  xs: "size-icon-xs", // 16px
  sm: "size-icon-sm", // 20px
  md: "size-icon-md", // 24px
  lg: "size-icon-lg", // 28px
  xl: "size-icon-xl", // 32px
};

export default function CloseButton({
  onClick,
  iconSize = "xs",
  hasBackground = true,
  className = "",
}: CloseButtonProps) {
  const wrapperClass = hasBackground
    ? "w-9 h-9 rounded-full bg-white text-gray-700"
    : "text-gray-400 hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="닫기"
      className={`flex justify-center items-center shrink-0 ${wrapperClass} ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={ICON_SIZE_CLASS[iconSize]}
      >
        <path
          d="M14.75 0.75L0.75 14.75M0.75 0.75L14.75 14.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
