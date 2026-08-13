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
  return (
    <div
      className="self-stretch shrink-0 h-[433px] relative overflow-hidden bg-white bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImageUrl})` }}
    >
      <div className="flex flex-col justify-start items-start w-[896px] absolute left-[72px] top-11 gap-[266px]">
        <CityReportHeader ratingBadge={ratingBadge} />
        <div className="flex items-center gap-4">
          <p className="heading-02 text-white">{cityName}</p>
          {purposeName && <p className="title-05 text-white">{purposeName}</p>}
        </div>
      </div>
    </div>
  );
}
