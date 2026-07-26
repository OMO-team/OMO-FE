type VerifyButtonProps = {
  active: boolean;
  onClick?: () => void;
  label?: string;
};

export default function VerifyButton({ active, onClick, label = '인증' }: VerifyButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!active}
      className={[
        'inline-flex h-[44px] shrink-0 items-center justify-center gap-1 rounded-2 px-[18px] py-2 body-02 transition-colors',
        active
          ? 'bg-primary-50 text-primary-500'
          : 'bg-gray-100 text-gray-400 cursor-default',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
