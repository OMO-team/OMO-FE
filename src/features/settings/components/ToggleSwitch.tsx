interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-[26px] w-[54px] shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary-500" : "bg-gray-200"
      } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-[22px] rounded-full bg-white transition-transform ${
          checked ? "translate-x-[28px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}
