import arrowDiagonalIcon from '../../../assets/icons/icon-arrow-diagonal.svg';

type CityCardProps = {
  name: string;
  imageUrl: string;
  recommendedCityCount: number;
  onClick?: () => void;
};

export default function CityCard({ name, imageUrl, recommendedCityCount, onClick }: CityCardProps) {
  return (
    <div className="relative w-[344px] h-[280px] rounded-4 overflow-hidden flex-shrink-0 cursor-pointer" onClick={onClick}>
      <img
        src={imageUrl}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(0deg, rgba(0, 27, 51, 0.60) 0%, rgba(0, 27, 51, 0.00) 86.07%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-start px-[22px] py-[20px] gap-2">
        <p className="heading-05 text-white">{name}</p>
        <div className="flex items-center gap-1 self-stretch">
          <span className="title-01 text-primary-100">추천도시 {recommendedCityCount}개 보기</span>
          <div className="flex justify-center items-center w-6 h-6">
            <img src={arrowDiagonalIcon} alt="이동" className="w-[14px] h-[14px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
