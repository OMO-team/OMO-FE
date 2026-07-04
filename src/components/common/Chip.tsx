interface ChipProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export default function Chip({ label, onClick, className = "" }: ChipProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex justify-center items-center gap-1 px-3 py-1.5 rounded-2 bg-white body-03 text-gray-700 ${className}`}
      >
        {label}
      </button>
    );
  }
  return (
    <div
      className={`flex justify-center items-center gap-1 px-3 py-1.5 rounded-2 bg-white body-03 text-gray-700 ${className}`}
    >
      {label}
    </div>
  );
}
