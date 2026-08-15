import { useLayoutEffect, useRef, useState } from "react";
import InfoCard from "./InfoCard";
import type { KeySummaryItem } from "../../../shared/types/cityReport";

interface KeySummaryProps {
  items: KeySummaryItem[];
}

export default function KeySummary({ items }: KeySummaryProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const measure = () => {
      const heights = cardRefs.current
        .slice(0, items.length)
        .filter((el): el is HTMLDivElement => el !== null)
        .map((el) => el.scrollHeight);
      setCardHeight(heights.length > 0 ? Math.max(...heights) : undefined);
    };
    measure();
    // 카드 폭이 창 크기에 따라 cqw로 줄어들면 텍스트가 더 많은 줄로 감싸져 필요한 높이가 바뀌므로 재측정
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  return (
    <div className="flex flex-col justify-start items-start self-stretch relative gap-6">
      <p className="heading-06 text-black self-stretch">핵심 요약</p>
      <div className="flex flex-wrap justify-start items-center self-stretch gap-4">
        {items.map((item, index) => (
          <InfoCard
            key={item.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            title={item.title}
            description={item.description}
            height={cardHeight}
          />
        ))}
      </div>
    </div>
  );
}
