import starIcon from '../../../assets/icons/star-icon.svg';
import HeartIcon from '../../../shared/components/HeartIcon';
import CardButtonGroup from '../../../shared/components/CardButtonGroup';
import ProgressBar from '../../../shared/components/ProgressBar';
import type { CityInsightData } from '../../../shared/types/cityInsight';

type CityInsightCardProps = CityInsightData & {
  isWished: boolean;
  onToggleWish?: () => void;
  onCompare?: () => void;
  onReport?: () => void;
};

export default function CityInsightCard({
  imageUrl,
  rating,
  cityName,
  countryName,
  description,
  monthlyCost,
  costPercent,
  accommodationPercent,
  accommodationLabel,
  visaPercent,
  visaLabel,
  securityScore,
  languageScore,
  infrastructureScore,
  isWished,
  onToggleWish,
  onCompare,
  onReport,
}: CityInsightCardProps) {
  const cityInfo = [
    { label: '치안', value: securityScore },
    { label: '어학', value: languageScore },
    { label: '인프라', value: infrastructureScore },
  ];

  return (
    <div className="w-130.5 overflow-hidden rounded-4 bg-white shadow-02 hover:border border-primary-500">
      <div className="relative h-62.5 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="relative flex items-center justify-between p-6">
          <span className="body-02 flex items-center gap-0.5 rounded-2 bg-black/30 px-3 py-1 text-white">
            <img src={starIcon} alt="star icon" className="h-4 w-4" />
            {rating}
          </span>
          <button type="button" onClick={onToggleWish} aria-label="찜하기">
            <HeartIcon isWished={isWished} />
          </button>
        </div>
      </div>

      <div className="flex flex-col px-9 py-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="title-01 text-black">{cityName}</span>
            <span className="body-05 rounded-2 bg-gray-100 px-2.5 py-1 text-gray-500">{countryName}</span>
          </div>
          <p className="label-01 text-gray-500">{description}</p>
        </div>

        <div className="mt-5">
          <div className="mb-1.75 flex items-center justify-between">
            <p className="body-02">월 평균 생활비</p>
            <p className="body-02">{monthlyCost}</p>
          </div>
          <ProgressBar percent={costPercent} leftLabel="낮음" rightLabel="높음" />
        </div>

        <div className="mt-3 flex gap-7.5">
          <div className="flex-1">
            <ProgressBar percent={accommodationPercent} leftLabel="숙소 구하기" rightLabel={accommodationLabel} />
          </div>
          <div className="flex-1">
            <ProgressBar percent={visaPercent} leftLabel="비자 구하기" rightLabel={visaLabel} />
          </div>
        </div>

        <div className="mt-4 mb-6 flex items-center justify-around divide-x divide-gray-200">
          {cityInfo.map((info) => (
            <div key={info.label} className="flex flex-1 flex-col items-center gap-1.5">
              <p className="label-01">{info.label}</p>
              <p className="title-02">{info.value}</p>
            </div>
          ))}
        </div>

        <CardButtonGroup onCompare={() => onCompare?.()} onReport={() => onReport?.()} />
      </div>
    </div>
  );
}
