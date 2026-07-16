import { useState } from 'react';
import CategoryTab from '../../../shared/components/CategoryTab';
import CityCard, { CITY_IMAGES } from './CityCard';

const CATEGORIES = ['워킹홀리데이', '교환학생', '인턴십'];

const SECTION_DATA: Record<string, { title: string; subtitle: string }> = {
  워킹홀리데이: {
    title: '어느 나라로 워킹홀리데이 준비를 시작할까요?',
    subtitle: 'OMO가 고른, 당신을 위한 워킹홀리데이 도시 리스트',
  },
  교환학생: {
    title: '어느 나라로 교환학생 준비를 시작할까요?',
    subtitle: 'OMO가 고른, 당신을 위한 교환학생 도시 리스트',
  },
  인턴십: {
    title: '어느 나라로 인턴십 준비를 시작할까요?',
    subtitle: 'OMO가 고른, 당신을 위한 인턴십 도시 리스트',
  },
};

const CITIES = [
  { name: '독일', count: 5 },
  { name: '호주', count: 12 },
  { name: '일본', count: 15 },
];

export default function CategorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = CATEGORIES[activeIndex];
  const { title, subtitle } = SECTION_DATA[activeCategory];

  return (
    <div className="flex flex-col items-start w-[1064px] gap-[40px]">

      {/* CategoryTab */}
      <CategoryTab
        categories={CATEGORIES}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />

      {/* Frame 118 */}
      <div className="flex flex-col items-start gap-[36px] self-stretch">

        {/* Frame 70: 타이틀 + 더보기 버튼 */}
        <div className="flex items-center justify-between self-stretch">
          {/* Frame 60: 타이틀 + 서브타이틀 */}
          <div className="flex flex-col items-start w-[482px] gap-[10px]">
            <p className="heading-04 text-gray-900 self-stretch">{title}</p>
            <p className="title-01 text-gray-500 self-stretch">{subtitle}</p>
          </div>

          {/* 더보기 버튼 */}
          <button
            type="button"
            className="flex justify-center items-center pl-[18px] pr-[12px] py-2 gap-1 rounded-[8px] bg-[#E5F3FF]"
          >
            <span className="body-02 text-primary-500">더보기</span>
            <div className="flex justify-center items-center w-4 h-4">
              <img src="/src/assets/icons/16_16_icon.svg" alt="더보기" />
            </div>
          </button>
        </div>

        {/* Carousel: 도시 카드 목록 */}
        <div className="flex items-center gap-4 self-stretch">
          <div className="flex items-center gap-4">
            {CITIES.map((city, i) => (
              <CityCard
                key={city.name}
                name={city.name}
                cityCount={city.count}
                imagePath={CITY_IMAGES[i]}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
