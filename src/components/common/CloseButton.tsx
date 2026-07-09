interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export default function CloseButton({
  onClick,
  className = "",
}: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="닫기"
      className={`flex justify-center items-center w-9 h-9 rounded-full bg-white ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-icon-xs"
      >
        <path
          d="M14.75 0.75L0.75 14.75M0.75 0.75L14.75 14.75"
          stroke="#404959"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
