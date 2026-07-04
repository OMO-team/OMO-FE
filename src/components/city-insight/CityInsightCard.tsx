import starIcon from '../../assets/icons/star-icon.svg'
import HeartIcon from '../common/HeartIcon';
import CardButtonGroup from '../common/CardButtonGroup';
import ProgressBar from '../common/ProgressBar';

interface CityInsightCardProps {
  imageUrl: string;
  rating: number;
  isWished: boolean;
  cityName: string;
  countryName: string;
  description: string;
  monthlyCost: string;
  costPercent: number;
  accommodationPercent: number;
  accommodationLabel: string;
  visaPercent: number;
  visaLabel: string;
  securityScore: number;
  languageScore: number;
  infrastructureScore: number;
  onCompare: () => void;
  onReport: () => void;
}

export default function CityInsightCard({
  imageUrl, rating, isWished, cityName, countryName, description,
  monthlyCost, costPercent,
  accommodationPercent, accommodationLabel,
  visaPercent, visaLabel,
  securityScore, languageScore, infrastructureScore,
  onCompare, onReport,
}: CityInsightCardProps) {
  const cityInfo = [
    { label: '치안', value: securityScore },
    { label: '어학', value: languageScore },
    { label: '인프라', value: infrastructureScore },
  ]

  return (
    <div className='w-[522px] h-[596px] bg-white rounded-4 shadow-02 hover:border border-primary-500 overflow-hidden'>

      {/* 카드 배경 */}
      <div
        className="relative h-[250px] bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="relative flex items-center justify-between p-6">
          <span className="body-02 flex items-center gap-0.5 rounded-2 bg-black/30 px-3 py-1 text-white">
            <img src={starIcon} alt="star icon" className="w-4 h-4" />
            {rating}
          </span>
          <button>
            <HeartIcon isWished={isWished} />
          </button>
        </div>
      </div>

      <div className="flex flex-col px-[36px] py-[20px]">

        {/* 도시 정보 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="title-01 text-black">{cityName}</span>
            <span className="body-05 rounded-2 bg-gray-100 px-2.5 py-1 text-gray-500">{countryName}</span>
          </div>
          <p className="label-01 text-gray-500">{description}</p>
        </div>

        {/* 월 평균 생활비 */}
        <div className='mt-[20px]'>
          <div className='flex items-center justify-between mb-[7px]'>
            <p className='Body-02'>월 평균 생활비</p>
            <p className='Body-02'>{monthlyCost}</p>
          </div>
          <ProgressBar percent={costPercent} leftLabel='낮음' rightLabel='높음' />
        </div>

        {/* 숙소 및 비자 구하기 난이도 */}
        <div className='flex gap-[30px] mt-3'>
          <div className='flex-1'>
            <ProgressBar percent={accommodationPercent} leftLabel='숙소 구하기' rightLabel={accommodationLabel} />
          </div>
          <div className='flex-1'>
            <ProgressBar percent={visaPercent} leftLabel='비자 구하기' rightLabel={visaLabel} />
          </div>
        </div>

        {/* 치안 & 어학 & 인프라 평점 */}
        <div className='flex justify-around items-center mt-4 mb-6 divide-x divide-gray-200'>
          {cityInfo.map((info, index) => (
            <div key={index} className='flex flex-col items-center gap-1.5 flex-1'>
              <p className='label-01'>{info.label}</p>
              <p className='Title-02'>{info.value}</p>
            </div>
          ))}
        </div>

        <CardButtonGroup onCompare={() => {}} onReport={() => {}} />
      </div>
    </div>
  )
}
