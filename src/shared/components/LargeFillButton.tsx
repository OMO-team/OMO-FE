type LargeFillButtonProps = {
  label: string;
  variant?: 'blue' | 'red' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
};

const VARIANT_CLASS: Record<NonNullable<LargeFillButtonProps['variant']>, string> = {
  blue: 'bg-primary-500 text-white',
  red: 'bg-[#FF2A14] text-white',
  outline: 'border border-gray-300 bg-white text-gray-600',
};

export default function LargeFillButton({ label, variant = 'blue', onClick, disabled }: LargeFillButtonProps) {
  return (
    <button
      type="button"
      className={`title-02 w-full rounded-2 px-24 py-3 disabled:opacity-50 ${VARIANT_CLASS[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
