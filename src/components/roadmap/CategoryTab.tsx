type CategoryTabProps = {
  tabs: string[];
  activeIndex: number;
  onChange?: (index: number) => void;
};

export default function CategoryTab({ tabs, activeIndex, onChange }: CategoryTabProps) {
  return (
    <div className="flex gap-1 rounded-3 bg-gray-50 p-2">
      {tabs.map((label, index) => (
        <button
          key={label}
          type="button"
          className={`title-01 h-11 w-[200px] whitespace-nowrap rounded-2 px-6 ${
            index === activeIndex ? 'bg-primary-500 text-gray-50' : 'bg-transparent text-gray-500'
          }`}
          onClick={() => onChange?.(index)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
