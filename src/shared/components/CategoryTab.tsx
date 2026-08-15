import { useLayoutEffect, useRef, useState } from 'react';

type CategoryTabProps = {
  categories: string[];
  activeIndex: number;
  onChange: (index: number) => void;
};

export default function CategoryTab({ categories, activeIndex, onChange }: CategoryTabProps) {
  // 버튼 하나당 최대 200px, gap-1(4px), p-2(16px) — flex intrinsic sizing이 자식의 max-width를
  // 그대로 반영하지 않아서 컨테이너 상한을 직접 계산해 style로 지정함
  const maxWrapperWidth = categories.length * 200 + Math.max(categories.length - 1, 0) * 4 + 16;

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const activeButton = buttonRefs.current[activeIndex];
    if (!activeButton) {
      setIndicator(null);
      return;
    }
    const update = () => setIndicator({ left: activeButton.offsetLeft, width: activeButton.offsetWidth });
    update();
    // 버튼이 flex-1이라 창 크기에 따라 폭이 바뀌고, 최초 렌더 시점 측정값이 레이아웃 확정 전이라
    // 어긋나는 경우도 있어 ResizeObserver로 실제 크기 변화를 계속 반영해야 인디케이터가 안 어긋난다
    const observer = new ResizeObserver(update);
    observer.observe(activeButton);
    return () => observer.disconnect();
  }, [activeIndex, categories.length]);

  return (
    <div
      className="relative flex w-full items-start gap-1 rounded-[12px] bg-gray-50 p-2"
      style={{ maxWidth: `${maxWrapperWidth}px` }}
    >
      {indicator && (
        <div
          aria-hidden
          className="absolute top-2 h-11 rounded-2 bg-primary-500 transition-[left,width] duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {categories.map((cat, i) => (
        <button
          key={cat}
          ref={(el) => {
            buttonRefs.current[i] = el;
          }}
          type="button"
          onClick={() => onChange(i)}
          className={`relative z-10 flex h-11 flex-1 min-w-0 max-w-[200px] items-center justify-center gap-1 rounded-2 px-[clamp(12px,4vw,50px)] py-2.5 title-01 whitespace-nowrap transition-colors duration-300 ${
            i === activeIndex ? 'text-gray-50' : 'text-gray-500'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
