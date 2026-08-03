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
    const heights = cardRefs.current
      .slice(0, items.length)
      .filter((el): el is HTMLDivElement => el !== null)
      .map((el) => el.scrollHeight);
    setCardHeight(heights.length > 0 ? Math.max(...heights) : undefined);
  }, [items]);

  const rows: KeySummaryItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col justify-start items-start self-stretch relative gap-6">
      <p className="heading-06 text-black self-stretch">핵심 요약</p>
      <div className="flex flex-col justify-start items-center self-stretch gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-start items-center gap-4">
            {row.map((item, indexInRow) => {
              const index = rowIndex * 2 + indexInRow;
              return (
                <InfoCard
                  key={item.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  title={item.title}
                  description={item.description}
                  height={cardHeight}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
