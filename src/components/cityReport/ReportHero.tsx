import CityReportHeader from "./CityReportHeader";

interface ReportHeroProps {
  cityName: string;
  heroImageUrl: string;
  ratingBadge: number;
  onClose: () => void;
}

export default function ReportHero({
  cityName,
  heroImageUrl,
  ratingBadge,
  onClose,
}: ReportHeroProps) {
  return (
    <div
      className="self-stretch h-[433px] relative overflow-hidden bg-white bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImageUrl})` }}
    >
      <div className="flex flex-col justify-start items-start w-[896px] absolute left-[72px] top-11 gap-[266px]">
        <CityReportHeader ratingBadge={ratingBadge} onClose={onClose} />
        <p className="heading-02 text-white">{cityName}</p>
      </div>
    </div>
  );
}
