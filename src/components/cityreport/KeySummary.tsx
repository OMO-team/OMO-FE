import InfoCard from "./InfoCard";
import type { KeySummaryItem } from "./types/cityReport";

interface KeySummaryProps {
  items: KeySummaryItem[];
}

export default function KeySummary({ items }: KeySummaryProps) {
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
            {row.map((item) => (
              <InfoCard
                key={item.id}
                title={item.title}
                description={item.description}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
