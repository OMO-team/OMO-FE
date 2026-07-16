import filterChipIcon from '../../../assets/icons/icon-filter-chip.svg'

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export default function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <div className="flex items-center gap-0.5 w-fit px-2.5 py-1 bg-blue-50 rounded-2">
      <p className="body-03 text-blue-500">{label}</p>
      <button onClick={onRemove}>
        <img src={filterChipIcon} alt="" />
      </button>
    </div>
  );
}
