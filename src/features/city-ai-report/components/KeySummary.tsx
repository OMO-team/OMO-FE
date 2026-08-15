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
      {/* gap-4(고정 16px)를 그대로 두면 카드는 cqw로 줄어드는데 간격만 안 줄어서, 화면이 좁아질수록
          간격이 상대적으로 커져 결국 넘쳐 줄바꿈된다. 간격도 같이 줄어들게 하고, cap을 440*2+16=896와
          완전히 같은 값 대신 살짝 낮춰(14px) 부동소수점 오차로 인한 우발적인 줄바꿈을 방지한다 */}
      <div className="flex flex-wrap justify-start items-center self-stretch gap-[clamp(8px,1.346154cqw,14px)]">
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
