type LargeFillButtonProps = {
  label: string;
  variant?: 'blue' | 'gray';
  onClick?: () => void;
};

const VARIANT_CLASS: Record<NonNullable<LargeFillButtonProps['variant']>, string> = {
  blue: 'bg-primary-500 text-white',
  gray: 'bg-gray-100 text-gray-600',
};

export default function LargeFillButton({ label, variant = 'blue', onClick }: LargeFillButtonProps) {
  return (
    <button
      type="button"
      className={`title-02 
        w-full rounded-2 px-24 py-3 ${VARIANT_CLASS[variant]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
