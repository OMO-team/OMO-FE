import { useState } from 'react';
import CategoryTab from '../../../shared/components/CategoryTab';
import CityCard from './CityCard';
import chevronRightIcon from '../../../assets/icons/chevron-right.svg';
import { usePurposes } from '../hooks/usePurposes';
import { useCountriesByPurpose } from '../hooks/useCountriesByPurpose';

export default function CategorySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: purposes = [] } = usePurposes();

  const activePurpose = purposes[activeIndex];
  const categoryNames = purposes.map(p => p.name);

  const { data: countries = [] } = useCountriesByPurpose(activePurpose?.type);

  return (
    <div className="flex flex-col items-start w-[1064px] gap-[40px]">

      <CategoryTab
        categories={categoryNames}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />

      <div className="flex flex-col items-start gap-[36px] self-stretch">

        <div className="flex items-center justify-between self-stretch">
          <div className="flex flex-col items-start w-[482px] gap-[10px]">
            <p className="heading-04 text-gray-900 self-stretch">
              {activePurpose ? `어느 나라로 ${activePurpose.name} 준비를 시작할까요?` : ''}
            </p>
            <p className="title-01 text-gray-500 self-stretch">
              {activePurpose ? `OMO가 고른, 당신을 위한 ${activePurpose.name} 도시 리스트` : ''}
            </p>
          </div>

          <button
            type="button"
            className="flex justify-center items-center pl-[18px] pr-[12px] py-2 gap-1 rounded-2 bg-primary-50"
          >
            <span className="body-02 text-primary-500">더보기</span>
            <div className="flex justify-center items-center w-4 h-4">
              <img src={chevronRightIcon} alt="더보기" />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-4 self-stretch">
          <div className="flex items-center gap-4">
            {countries.map(country => (
              <CityCard
                key={country.countryId}
                name={country.name}
                code={country.code}
                imageUrl={country.imageUrl}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
