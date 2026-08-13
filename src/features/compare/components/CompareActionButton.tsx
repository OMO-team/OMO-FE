type CompareActionButtonVariant = "primary" | "dark";
/** pill: 하단 비교함 바의 알약 버튼. rounded: 비교 모달 카드 하단의 사각 CTA */
type CompareActionButtonShape = "pill" | "rounded";

interface CompareActionButtonProps {
  label: string;
  variant?: CompareActionButtonVariant;
  shape?: CompareActionButtonShape;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const VARIANT_CLASS: Record<CompareActionButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white disabled:bg-gray-300 disabled:text-gray-500",
  dark: "bg-black text-white disabled:bg-gray-700 disabled:text-gray-400",
};

const SHAPE_CLASS: Record<CompareActionButtonShape, string> = {
  pill: "rounded-full px-5 py-2",
  rounded: "h-[46px] rounded-2 px-5",
};

export default function CompareActionButton({
  label,
  variant = "primary",
  shape = "pill",
  disabled = false,
  onClick,
  className = "",
}: CompareActionButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`title-03 transition-colors disabled:cursor-not-allowed ${SHAPE_CLASS[shape]} ${VARIANT_CLASS[variant]} ${className}`}
    >
      {label}
    </button>
  );
}
