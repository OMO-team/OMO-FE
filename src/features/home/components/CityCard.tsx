import countryCard1 from '../../../assets/images/country_card_1.png';
import countryCard2 from '../../../assets/images/country_card_2.png';
import countryCard3 from '../../../assets/images/country_card_3.png';

export const CITY_IMAGES = [countryCard1, countryCard2, countryCard3];

type CityCardProps = {
  name: string;
  cityCount: number;
  imagePath: string;
};

export default function CityCard({ name, cityCount, imagePath }: CityCardProps) {
  return (
    <div className="relative w-[344px] h-[280px] rounded-[16px] overflow-hidden flex-shrink-0">
      <img
        src={imagePath}
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
          <span className="title-01 text-[#C2E2FF]">추천도시 {cityCount}개 보기</span>
          <div className="flex justify-center items-center w-6 h-6">
            <img
              src="/src/assets/icons/Vector_diagonal.svg"
              alt="이동"
              className="w-[14px] h-[14px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
