// react
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
import { useCities } from '../hooks/useCities';

// utils
import { adaptCityToCardProps } from '../utils/cityAdapter';

// types
import type { CityQueryParams, ContinentType, DifficultyType, StayDurationType } from '../types/cityInsight';

// stores
import { useRoadmapStore } from '../../roadmap/store/useRoadmapStore';
import { useCompareStore } from '../../compare/store/useCompareStore';

// types
import type { CityReportData } from '../../../shared/types/cityReport';

// constants & mocks
import { DETAIL_OPTIONS } from '../constants/filterOptions';
import { berlinReportData, mockSearchResult } from '../../city-ai-report/mocks/mockData';
import { mockCities } from '../../../shared/mocks/cities';

// assets
import backArrow from '../../../assets/icons/back-arrow.svg';
import filterResetIcon from '../../../assets/icons/icon-filter-reset.svg';
import searchInputIcon from '../../../assets/icons/search-input-list.svg';

// API 파라미터 값 변환
const MONTHLY_COST_MAP: Record<string, number> = {
  '150 만원': 150, '200 만원': 200, '300 만원': 300,
};
const SAFETY_SCORE_MAP: Record<string, number> = {
  '5점': 5, '4점': 4, '3점': 3,
};
const DIFFICULTY_MAP: Record<string, DifficultyType> = {
  '쉬움': 'EASY', '보통': 'NORMAL', '어려움': 'HARD',
};
const STAY_DURATION_MAP: Record<string, StayDurationType> = {
  '3개월 이하': 'SHORT', '3 - 6개월': 'MEDIUM', '6개월 - 1년': 'LONG', '1년 이상': 'VERY_LONG',
};

const CITY_REPORT_DATA: Record<string, CityReportData> = {
  베를린: berlinReportData,
};

const CITY_COMPARE_ID: Record<string, string> = {
  베를린: 'berlin',
  도쿄: 'tokyo',
  시드니: 'sydney',
};

export default function CityInsight() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: purposes = [] } = usePurposes();

  const purposeIdParam = Number(searchParams.get('purposeId'));
  const activeIndex = Math.max(0, purposes.findIndex(p => p.purposeId === purposeIdParam));
  const categoryNames = purposes.map(p => p.name);

  const handleCategoryChange = (index: number) => {
    const selected = purposes[index];
    if (!selected) return;
    const params: Record<string, string> = { purposeId: String(selected.purposeId) };
    if (urlCountryCode) params.countryCode = urlCountryCode;
    setSearchParams(params);
  };

  const urlKeyword = searchParams.get('keyword') ?? '';
  const urlCountryCode = searchParams.get('countryCode') ?? undefined;

  // 진입 경로 판단
  const isFromCountry = !!urlCountryCode;  
  const isFromSearch = !!urlKeyword;       

  const [input, setInput] = useState(urlKeyword);
  const [keyword, setKeyword] = useState(urlKeyword);

  useEffect(() => {
    setInput(urlKeyword);
    setKeyword(urlKeyword);
  }, [urlKeyword]);
  const [page, setPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedContinent, setSelectedContinent] = useState<ContinentType | undefined>(undefined);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);
  const [reportCityName, setReportCityName] = useState<string | null>(null);
  const [addedCityName, setAddedCityName] = useState<string | null>(null);
  const addCity = useRoadmapStore(s => s.addCity);
  const toggleCompare = useCompareStore(s => s.toggleCompare);

  const activePurpose = purposes[activeIndex];

  const queryParams = useMemo<CityQueryParams>(() => ({
    keyword: keyword || undefined,
    purposeType: isFromSearch ? undefined : activePurpose?.type,
    countryCode: urlCountryCode,
    continent: selectedContinent,
    maxMonthlyCost: MONTHLY_COST_MAP[selectedOptions['월 생활비']],
    minSafetyScore: SAFETY_SCORE_MAP[selectedOptions['치안']],
    housingDifficulty: DIFFICULTY_MAP[selectedOptions['숙소 난이도']],
    visaDifficulty: DIFFICULTY_MAP[selectedOptions['비자 난이도']],
    stayDuration: STAY_DURATION_MAP[selectedOptions['체류 기간']],
  }), [keyword, activePurpose, urlCountryCode, selectedContinent, selectedOptions]);

  const { data: cities = [] } = useCities(queryParams);

  const PAGE_SIZE = 6;
  const totalPages = Math.max(1, Math.ceil(cities.length / PAGE_SIZE));
  const pagedCities = cities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [cities]);

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

  const handleSelect = (continent: ContinentType) => {
    setSelectedFilters(prev => (prev.includes(continent) ? prev : [...prev, continent]));
    setSelectedContinent(continent);
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

  const handleSearch = () => setKeyword(input);

  // 필터 전체 초기화
  const handleReset = () => {
    setInput('');
    setKeyword('');
    setSelectedFilters([]);
    setSelectedContinent(undefined);
    setSelectedOptions({});
    setResetKey(prev => prev + 1);
  };

  const reportData = reportCityName ? CITY_REPORT_DATA[reportCityName] : null;

  const handleAddToRoadmap = () => {
    const city = cities.find(c => c.name === reportCityName);
    if (!city) return;
    addCity({
      cityId: String(city.cityId),
      cityName: city.name,
      countryName: city.country.name,
      description: city.description,
      rating: city.rating,
      imageUrl: city.imageUrl,
      progressPercent: 0,
      costProgressPercent: 0,
      completedSteps: 0,
      totalSteps: 0,
      nextSchedule: '아직 일정이 없어요',
    });
    setReportCityName(null);
    setAddedCityName(city.name);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-[30px]">
      <div className="w-[1064px]">
        {!isFromCountry && (
          <div className={`mb-6 ${isFromSearch ? 'border-b border-gray-200 pb-[30px]' : ''}`}>
            {isFromSearch ? (
              <h1 className="heading-05">
                <span className="text-blue-500">'{urlKeyword}'</span>에 대한 검색 결과
              </h1>
            ) : (
              <div className="flex items-center gap-5">
                <button type="button" onClick={() => navigate('/')}>
                  <img src={backArrow} alt="뒤로가기" />
                </button>
                <h1 className="heading-05">추천 도시</h1>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-4">
          {!isFromSearch && (
            <>
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
                onSearch={handleSearch}
                icon={searchInputIcon}
              />
            </>
          )}
           {isFromSearch && (
              <p className="body-03 text-gray-500">총 {cities.length}개의 검색결과가 나왔어요</p>
            )}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <DetailDropDown selectedOptions={selectedOptions} onSelect={handleSelectOption} />
              <RegionDropDown
                key={`region-${resetKey}`}
                purposeType={activePurpose?.type}
                onSelect={handleSelect}
                onReset={() => { setSelectedFilters([]); setSelectedContinent(undefined); }}
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
        {cities.length !== 0 ? (
          <>
            <div className="mt-11 grid grid-cols-2 gap-5">
              {pagedCities.map(city => (
                <CityInsightCard
                  key={city.cityId}
                  imageUrl={city.imageUrl}
                  rating={city.rating}
                  isWishlisted={city.isWishlisted}
                  name={city.name}
                  countryName={city.country.name}
                  description={city.description}
                  monthlyCost={city.monthlyCost}
                  safetyScore={city.safetyScore}
                  languageScore={city.languageScore}
                  internetScore={city.internetScore}
                  {...adaptCityToCardProps(city)}
                  onCompare={() => handleCompare(city.name)}
                  onReport={() => setReportCityName(city.name)}
                />
              ))}
            </div>
            <div className="mt-25 mb-[304px]">
              <PageNavigation
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
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
