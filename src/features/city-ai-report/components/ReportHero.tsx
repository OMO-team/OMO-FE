import { useLayoutEffect, useRef, useState } from "react";
import CityReportHeader from "./CityReportHeader";

interface ReportHeroProps {
  cityName: string;
  heroImageUrl: string;
  ratingBadge: number;
  /**
   * 어떤 목적으로 이 도시를 보고 있는지 (예: 워킹홀리데이).
   * 도시가 아니라 화면 문맥에 딸린 값이라, 목적 없이 들어오는 경로(검색)에서는 넘기지 않는다.
   */
  purposeName?: string;
}

export default function ReportHero({
  cityName,
  heroImageUrl,
  ratingBadge,
  purposeName,
}: ReportHeroProps) {
  const cityNameRef = useRef<HTMLParagraphElement>(null);
  // 이름이 짧아 한 줄로 들어가면(대부분의 경우, 전체 화면 포함) dev 원본 그대로 이름 옆에 목적명을 두고,
  // 좁은 화면에서 긴 이름이 두 줄로 줄바꿈될 때만 목적명을 이름 아래로 내린다
  const [isCityNameWrapped, setIsCityNameWrapped] = useState(false);

  useLayoutEffect(() => {
    const check = () => {
      if (!cityNameRef.current) return;
      // <p>는 block 요소라 getClientRects()가 줄 단위가 아니라 박스 전체 1개만 반환한다.
      // Range로 텍스트 콘텐츠 자체를 측정해야 줄바꿈 여부(줄마다 rect 1개)를 정확히 알 수 있다.
      const range = document.createRange();
      range.selectNodeContents(cityNameRef.current);
      setIsCityNameWrapped(range.getClientRects().length > 1);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [cityName]);

  return (
    <div
      className="self-stretch shrink-0 h-[433px] relative overflow-hidden bg-white bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImageUrl})` }}
    >
      {/* 왼쪽 오프셋과 같은 여백(최소 24px, 최대 72px) 기준으로 폭을 계산해 오른쪽 여백도 항상 대칭 유지 */}
      <div className="flex w-[calc(100cqw_-_2*clamp(24px,6.923077cqw,72px))] flex-col items-start justify-start absolute left-[clamp(24px,6.923077cqw,72px)] top-11 gap-[266px]">
        <CityReportHeader ratingBadge={ratingBadge} />
        <div
          className={
            isCityNameWrapped
              ? "flex flex-col items-start gap-2"
              : "flex flex-row items-center gap-4"
          }
        >
          <p ref={cityNameRef} className="heading-02 text-white">{cityName}</p>
          {purposeName && <p className="title-05 text-white">{purposeName}</p>}
        </div>
      </div>
    </div>
  );
}
