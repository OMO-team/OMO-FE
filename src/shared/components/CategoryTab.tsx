type CategoryTabProps = {
  categories: string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export default function CategoryTab({ categories, activeIndex, onChange }: CategoryTabProps) {
  // 버튼 하나당 최대 200px, gap-1(4px), p-2(16px) — flex intrinsic sizing이 자식의 max-width를
  // 그대로 반영하지 않아서 컨테이너 상한을 직접 계산해 style로 지정함
  const maxWrapperWidth = categories.length * 200 + Math.max(categories.length - 1, 0) * 4 + 16;

  return (
    <div
      className="flex w-full items-start gap-1 rounded-[12px] bg-gray-50 p-2"
      style={{ maxWidth: `${maxWrapperWidth}px` }}
    >
      {categories.map((cat, i) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(i)}
          className={`flex h-11 flex-1 min-w-0 max-w-[200px] items-center justify-center gap-1 rounded-2 px-[clamp(12px,4vw,50px)] py-2.5 title-01 whitespace-nowrap ${
            i === activeIndex ? 'bg-primary-500 text-gray-50' : 'text-gray-500'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
