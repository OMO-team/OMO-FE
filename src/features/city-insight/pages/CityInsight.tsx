// react
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// shared components
import CategoryTab from '../../../shared/components/CategoryTab';
import SearchInputBar from '../../../shared/components/SearchInputBar';
import DropDown from '../../../shared/components/DropDown';
import PageNavigation from '../../../shared/components/PageNavigation';
import FilterIcon from '../../../shared/components/FilterIcon';

// feature components
import CityInsightCard from '../components/CityInsightCard';
import DetailDropDown from '../components/DetailDropDown';
import RegionDropDown from '../components/RegionDropDown';
import FilterChip from '../components/FilterChip';
import CityReportModal from '../../city-ai-report/components/CityReportModal';
import RoadmapAddedToast from '../../roadmap/components/RoadmapAddedToast';
import CompareSelectionBar from '../../compare/components/CompareSelectionBar';
import CompareModal from '../../compare/components/CompareModal';

// hooks
import { usePurposes } from '../../home/hooks/usePurposes';

// stores
import { useRoadmapStore } from '../../roadmap/store/useRoadmapStore';
import { useCompareStore } from '../../compare/store/useCompareStore';

// types
import type { CityReportData } from '../../../shared/types/cityReport';

// constants & mocks
import { DETAIL_OPTIONS } from '../constants/filterOptions';
import { CITY_INSIGHT_CARDS } from '../mocks/cityInsightCards';
import { berlinReportData, mockSearchResult } from '../../city-ai-report/mocks/mockData';
import { mockCities } from '../../../shared/mocks/cities';

// assets
import backArrow from '../../../assets/icons/back-arrow.svg';
import filterResetIcon from '../../../assets/icons/icon-filter-reset.svg';
import searchInputIcon from '../../../assets/icons/search-input-list.svg'

const CITY_REPORT_DATA: Record<string, CityReportData> = {
  베를린: berlinReportData,
};

// TODO: 도시별 실제 데이터 연동 전까지, 비교 목데이터가 있는 도시만 매핑
const CITY_COMPARE_ID: Record<string, string> = {
  베를린: 'berlin',
  도쿄: 'tokyo',
  시드니: 'sydney',
};

export default function CityInsight() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: purposes = [] } = usePurposes();

  const purposeIdParam = Number(searchParams.get('purposeId'));
  const activeIndex = Math.max(0, purposes.findIndex(p => p.purposeId === purposeIdParam));
  const categoryNames = purposes.map(p => p.name);

  const handleCategoryChange = (index: number) => {
    const selected = purposes[index];
    if (!selected) return;
    setSearchParams({ purposeId: String(selected.purposeId) });
  };

  const [input, setInput] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);
  const [reportCityName, setReportCityName] = useState<string | null>(null);
  const [addedCityName, setAddedCityName] = useState<string | null>(null);
  const addCity = useRoadmapStore(s => s.addCity);
  const toggleCompare = useCompareStore(s => s.toggleCompare);

  const handleCompare = (cityName: string) => {
    const id = CITY_COMPARE_ID[cityName];
    if (!id) return;
    toggleCompare(id);
  };

  useEffect(() => {
    if (!addedCityName) return;
    const timer = setTimeout(() => setAddedCityName(null), 5000);
    return () => clearTimeout(timer);
  }, [addedCityName]);

  const handleSelect = (country: string) => {
    setSelectedFilters(prev => (prev.includes(country) ? prev : [...prev, country]));
  };

  const handleSelectOption = (title: string, option: string) => {
    setSelectedOptions(prev => {
      if (prev[title] === option) {
        const { [title]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [title]: option };
    });
  };

  const handleReset = () => {
    setSelectedFilters([]);
    setSelectedOptions({});
    setResetKey(prev => prev + 1);
  };

  const reportData = reportCityName ? CITY_REPORT_DATA[reportCityName] : null;

  const handleAddToRoadmap = () => {
    const card = CITY_INSIGHT_CARDS.find(c => c.cityName === reportCityName);
    if (!card) return;
    addCity({
      // TODO: CITY_INSIGHT_CARDS에 실제 cityId가 생기면 교체 (지금은 cityName을 임시 식별자로 사용)
      cityId: card.cityName,
      cityName: card.cityName,
      countryName: card.countryName,
      description: card.description,
      rating: card.rating,
      imageUrl: card.imageUrl,
      progressPercent: 0,
      costProgressPercent: 0,
      completedSteps: 0,
      totalSteps: 0,
      nextSchedule: '아직 일정이 없어요',
    });
    setReportCityName(null);
    setAddedCityName(card.cityName);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div>
        <div className="mt-[50px] flex gap-5 mb-6">
          <img src={backArrow} alt="" />
          <h1 className="heading-05">추천 도시</h1>
        </div>
        <div className="flex flex-col gap-4">
          <CategoryTab
            categories={categoryNames}
            activeIndex={activeIndex}
            onChange={handleCategoryChange}
          />
          <SearchInputBar
            placeholder="원하는 도시 조건을 입력해 보세요"
            width="w-[974px]"
            value={input}
            onChange={setInput}
            onSearch={() => {}}
            icon={searchInputIcon}
          />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <DetailDropDown selectedOptions={selectedOptions} onSelect={handleSelectOption} />
              <RegionDropDown
                key={`region-${resetKey}`}
                onSelect={handleSelect}
                onReset={() => setSelectedFilters([])}
              />
              <div className="w-px h-7 bg-gray-300"></div>
              {DETAIL_OPTIONS.map(({ title, options }) => (
                <DropDown
                  key={title}
                  title={title}
                  options={options}
                  selectedOption={selectedOptions[title] ?? null}
                  onSelect={option => handleSelectOption(title, option)}
                />
              ))}
            </div>
            <button className="flex items-center gap-1" onClick={handleReset}>
              <p className="body-03 text-gray-400">필터 초기화</p>
              <img src={filterResetIcon} alt="" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          {selectedFilters.map(filter => (
            <FilterChip
              key={filter}
              label={filter}
              onRemove={() => setSelectedFilters(prev => prev.filter(v => v !== filter))}
            />
          ))}
        </div>
        {CITY_INSIGHT_CARDS.length !== 0 ? (
          <>
            <div className="mt-11 grid grid-cols-2 gap-5">
              {CITY_INSIGHT_CARDS.map(card => (
                <CityInsightCard
                  key={card.cityName}
                  {...card}
                  onCompare={() => handleCompare(card.cityName)}
                  onReport={() => setReportCityName(card.cityName)}
                />
              ))}
            </div>
            <div className="mt-25 mb-[304px]">
              <PageNavigation currentPage={1} totalPages={3} />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-[30px] items-center mt-[298px] mb-[295px]">
            <div className="w-[70px] h-[70px] bg-[#F1F8FF] flex justify-center items-center rounded-full">
              <FilterIcon width={42} height={42} />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h1 className="heading-05 text-gray-600">조건에 맞는 도시가 없습니다.</h1>
              <p className="title-03 text-gray-300">필터를 완화하면 더 많은 도시를 볼 수 있어요.</p>
            </div>
            <button
              className="bg-blue-100 text-blue-400 px-[26px] py-3 title-02 rounded-[12px] hover:bg-[#9FD2FF]"
              onClick={handleReset}
            >
              필터 초기화 하기
            </button>
          </div>
        )}
      </div>
      {reportData && (
        <CityReportModal
          isOpen
          onClose={() => setReportCityName(null)}
          data={reportData}
          onSearch={mockSearchResult}
          onAddToRoadmap={handleAddToRoadmap}
        />
      )}
      {addedCityName && (
        <RoadmapAddedToast cityName={addedCityName} onClose={() => setAddedCityName(null)} />
      )}
      <CompareSelectionBar cities={mockCities} />
      <CompareModal cities={mockCities} />
    </div>
  );
}
