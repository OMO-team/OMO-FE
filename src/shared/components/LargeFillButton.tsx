type LargeFillButtonProps = {
  label: string;
  variant?: 'blue' | 'red' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const VARIANT_CLASS: Record<NonNullable<LargeFillButtonProps['variant']>, string> = {
  blue: 'title-02 w-full rounded-lg bg-primary-500 py-[14px] text-white hover:opacity-90 transition-opacity',
  red: 'title-05 w-full rounded-lg bg-red-500 py-[14px] text-white hover:opacity-90 transition-opacity',
  outline: 'title-02 w-[180px] shrink-0 rounded-lg bg-gray-100 px-[18px] py-3 text-gray-600 hover:bg-gray-200 transition-colors',
};

export default function LargeFillButton({ label, variant = 'blue', onClick, disabled, className }: LargeFillButtonProps) {
  return (
    <button
      type="button"
      className={`flex h-12 items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASS[variant]} ${className ?? ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
