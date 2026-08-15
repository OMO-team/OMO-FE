import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryTab from '../../../shared/components/CategoryTab';
import CityCard from './CityCard';
import ChevronDownIcon from '../../../shared/components/ChevronDownIcon';
import { usePurposes } from '../hooks/usePurposes';
import { useCountriesByPurpose } from '../hooks/useCountriesByPurpose';

export default function CategorySection() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const { data: purposes = [] } = usePurposes();

  const activePurpose = purposes[activeIndex];
  const categoryNames = purposes.map(p => p.name);

  const { data: countries = [] } = useCountriesByPurpose(activePurpose?.type);
  const visibleCountries = countries.slice(0, showMore ? 6 : 3);

  return (
    <div className="flex w-full max-w-[1064px] flex-col items-start gap-[40px]">

      <CategoryTab
        categories={categoryNames}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />

      <div className="flex flex-col items-start gap-[36px] self-stretch">

        <div className="flex flex-wrap items-center justify-between gap-3 self-stretch">
          <div className="flex w-full max-w-[482px] flex-col items-start gap-[10px]">
            <p className="heading-04 break-keep text-gray-900 self-stretch">
              {activePurpose && (
                <>
                  <span className="whitespace-nowrap">{`어느 나라로 ${activePurpose.name} 준비를`}</span>
                  <br className="sm:hidden" />
                  {' 시작할까요?'}
                </>
              )}
            </p>
            <p className="title-01 text-gray-500 self-stretch">
              {activePurpose ? `OMO가 고른, 당신을 위한 ${activePurpose.name} 도시 리스트` : ''}
            </p>
          </div>

          {countries.length > 3 && (
            <button
              type="button"
              className="flex justify-center items-center pl-[18px] pr-[12px] py-2 gap-1 rounded-2 bg-primary-50"
              onClick={() => setShowMore(prev => !prev)}
            >
              <span className="body-02 text-primary-500">더보기</span>
              <div className="flex justify-center items-center w-4 h-4">
                <ChevronDownIcon
                  color="#3b82f6"
                  className={`transition-transform duration-200 ${showMore ? '' : '-rotate-90'}`}
                />
              </div>
            </button>
          )}
        </div>

        <div className="grid gap-4 self-stretch" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))' }}>
          {visibleCountries.map(country => (
            <CityCard
              key={country.countryId}
              name={country.name}
              imageUrl={country.imageUrl}
              recommendedCityCount={country.recommendedCityCount}
              onClick={() => navigate(`/city-insight?purposeId=${activePurpose?.purposeId}&countryCodes=${country.code}`)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
