type CategoryTabProps = {
  categories: string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export default function CategoryTab({ categories, activeIndex, onChange }: CategoryTabProps) {
  return (
    <div className="flex p-2 items-start gap-1 rounded-[12px] bg-gray-50">
      {categories.map((cat, i) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(i)}
          className={`flex w-[200px] h-[44px] px-[50px] py-[10px] justify-center items-center gap-1 rounded-[8px] title-01 ${
            i === activeIndex ? 'bg-primary-500 text-gray-50' : 'text-gray-500'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
