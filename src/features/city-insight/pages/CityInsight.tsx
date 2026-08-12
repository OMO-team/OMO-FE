// react
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// shared components
import CategoryTab from '../../../shared/components/CategoryTab';
import SearchInputBar from '../../../shared/components/SearchInputBar';
import DropDown from '../../../shared/components/DropDown';
import PageNavigation from '../../../shared/components/PageNavigation';
import FilterIcon from '../../../shared/components/FilterIcon';
import SmartBriefingFAB from '../../../shared/components/SmartBriefingFAB';

// feature components
import CityInsightCard from '../components/CityInsightCard';
import DetailDropDown from '../components/DetailDropDown';
import RegionDropDown from '../components/RegionDropDown';
import FilterChip from '../components/FilterChip';
import CityReportModal from '../../city-ai-report/components/CityReportModal';
import { cityAiReportApi } from '../../city-ai-report/api/cityAiReportApi';
import { roadmapsApi } from '../../roadmap/api/roadmapsApi';
import { wishlistApi } from '../../roadmap/api/wishlistApi';
import { roadmapQueryKeys, wishlistQueryKeys } from '../../roadmap/api/queryKeys';
import { getErrorMessage } from '../../roadmap/api/apiUtils';
import RoadmapAddedToast from '../../roadmap/components/RoadmapAddedToast';
import CompareSelectionBar from '../../compare/components/CompareSelectionBar';
import CompareModal from '../../compare/components/CompareModal';

// hooks
import { usePurposes } from '../../home/hooks/usePurposes';
import { useCities } from '../hooks/useCities';

// utils
import { adaptCityToCardProps } from '../utils/cityAdapter';

// types
import type { CityItem, CityQueryParams, DifficultyType, StayDurationType } from '../types/cityInsight';

// stores
import { useCompareStore } from '../../compare/store/useCompareStore';

// utils
import { buildCityReportData } from '../../roadmap/utils/buildCityReportData';

// constants & mocks
import { DETAIL_OPTIONS } from '../constants/filterOptions';
import { CITY_INSIGHT_CARDS } from '../mocks/cityInsightCards';

// assets
import backArrow from '../../../assets/icons/back-arrow.svg';
import filterResetIcon from '../../../assets/icons/icon-filter-reset.svg';

// API 파라미터 값 변환
const MONTHLY_COST_MAP: Record<string, number> = {
  '150 만원': 150,
  '200 만원': 200,
  '300 만원': 300,
};
const SAFETY_SCORE_MAP: Record<string, number> = {
  '5점': 5,
  '4점': 4,
  '3점': 3,
};
const DIFFICULTY_MAP: Record<string, DifficultyType> = {
  쉬움: 'EASY',
  보통: 'NORMAL',
  어려움: 'HARD',
};
const STAY_DURATION_MAP: Record<string, StayDurationType> = {
  '3개월 이하': 'SHORT',
  '3 - 6개월': 'MEDIUM',
  '6개월 - 1년': 'LONG',
  '1년 이상': 'VERY_LONG',
};

export default function CityInsight() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlKeyword = searchParams.get('keyword') ?? '';
  const urlCountryCodes = searchParams.getAll('countryCodes');

  // 진입 경로 판단 — keyword와 countryCodes는 상호 배타적으로 처리
  const isFromSearch = !!urlKeyword;
  const isFromCountry = !isFromSearch;

  const { data: purposes = [] } = usePurposes({ enabled: !isFromSearch });

  const purposeIdParam = Number(searchParams.get('purposeId'));
  const activeIndex = Math.max(
    0,
    purposes.findIndex(p => p.purposeId === purposeIdParam)
  );
  const categoryNames = purposes.map(p => p.name);

  const handleCategoryChange = (index: number) => {
    const selected = purposes[index];
    if (!selected) return;
    const sp = new URLSearchParams({ purposeId: String(selected.purposeId) });
    urlCountryCodes.forEach(code => sp.append('countryCodes', code));
    setSearchParams(sp);
  };

  const [input, setInput] = useState(urlKeyword);
  const [keyword, setKeyword] = useState(urlKeyword);
  const [prevUrlKeyword, setPrevUrlKeyword] = useState(urlKeyword);
  if (prevUrlKeyword !== urlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    setInput(urlKeyword);
    setKeyword(urlKeyword);
  }
  const [page, setPage] = useState(1);
  const [selectedCountries, setSelectedCountries] = useState<{ name: string; code: string }[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [resetKey, setResetKey] = useState(0);
  const [reportCityName, setReportCityName] = useState<string | null>(null);
  const [addedRoadmap, setAddedRoadmap] = useState<{ roadmapId: number; cityName: string } | null>(null);
  const [addErrorMessage, setAddErrorMessage] = useState<string | null>(null);
  const toggleCompare = useCompareStore(s => s.toggleCompare);
  const resetCompare = useCompareStore(s => s.resetCompare);
  const closeCompareModal = useCompareStore(s => s.closeModal);

  /**
   * 검색으로 들어오면 목적을 고르는 단계가 없어 선택된 목적도 없다.
   * usePurposes는 enabled가 false여도 캐시된 목록을 그대로 돌려주기 때문에
   * (메인 화면이 같은 키로 미리 받아둠) 여기서 걸러주지 않으면
   * 첫 번째 목적(워킹홀리데이)이 선택된 것처럼 잡힌다.
   */
  const activePurpose = isFromSearch ? undefined : purposes[activeIndex];

  const queryParams = useMemo<CityQueryParams>(() => {
    const currentCountryCodes = searchParams.getAll('countryCodes');
    const selectedCodes = selectedCountries.map(c => c.code);
    const activeCodes = selectedCodes.length > 0 ? selectedCodes : currentCountryCodes;
    return {
      keyword: keyword || undefined,
      purposeType: isFromSearch ? undefined : activePurpose?.type,
      countryCodes: activeCodes.length > 0 ? activeCodes : undefined,
      maxMonthlyCost: MONTHLY_COST_MAP[selectedOptions['월 생활비']],
      minSafetyScore: SAFETY_SCORE_MAP[selectedOptions['치안']],
      housingDifficulty: DIFFICULTY_MAP[selectedOptions['숙소 난이도']],
      visaDifficulty: DIFFICULTY_MAP[selectedOptions['비자 난이도']],
      stayDuration: STAY_DURATION_MAP[selectedOptions['체류 기간']],
    };
  }, [keyword, isFromSearch, activePurpose, selectedCountries, searchParams, selectedOptions]);

  const [prevQueryParams, setPrevQueryParams] = useState(queryParams);
  if (prevQueryParams !== queryParams) {
    setPrevQueryParams(queryParams);
    setPage(1);
  }

  const PAGE_SIZE = 6;
  // 필터(queryParams)와 별개로 관리 — page가 바뀔 때마다 apiParams가 바뀌면
  // 위 "필터 변경 시 1페이지로 리셋" 로직이 페이지 이동을 필터 변경으로 오인해서 무한 리셋됨
  const apiParams = useMemo<CityQueryParams>(
    () => ({ ...queryParams, page: page - 1, size: PAGE_SIZE }), // 백엔드 page는 0-indexed
    [queryParams, page],
  );

  const { data: citiesResult } = useCities(apiParams, {
    enabled: isFromSearch || !!activePurpose,
  });

  const cities = citiesResult?.data ?? [];
  const totalElements = citiesResult?.totalElements ?? 0;
  const totalPages = Math.max(1, citiesResult?.totalPages ?? 1);

  useEffect(() => {
    if (!addedRoadmap) return;
    const timer = setTimeout(() => setAddedRoadmap(null), 5000);
    return () => clearTimeout(timer);
  }, [addedRoadmap]);

  const createRoadmapMutation = useMutation({
    mutationFn: ({ cityId, purposeId }: { cityId: number; purposeId: number }) =>
      roadmapsApi.create({ cityId, purposeId }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.all }),
  });

  /** 위시리스트도 로드맵과 마찬가지로 목적이 있어야 담을 수 있음 — 검색 진입에는 목적이 없어 토글 불가 */
  const invalidateWishRelatedQueries = () => {
    queryClient.invalidateQueries({ queryKey: wishlistQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: ['cities'] });
  };
  const addWishMutation = useMutation({
    mutationFn: ({ cityId, purposeId }: { cityId: number; purposeId: number }) =>
      wishlistApi.add(cityId, purposeId),
    onSuccess: invalidateWishRelatedQueries,
  });
  const removeWishMutation = useMutation({
    mutationFn: ({ cityId, purposeId }: { cityId: number; purposeId: number }) =>
      wishlistApi.remove(cityId, purposeId),
    onSuccess: invalidateWishRelatedQueries,
  });
  const handleToggleWish = (city: CityItem) => {
    const purposeId = activePurpose?.purposeId;
    if (purposeId == null) {
      console.error('목적 없이는 위시리스트를 바꿀 수 없음', city.cityId);
      return;
    }
    if (city.isWishlisted) {
      removeWishMutation.mutate({ cityId: city.cityId, purposeId });
    } else {
      addWishMutation.mutate({ cityId: city.cityId, purposeId });
    }
  };

  // 이 화면을 벗어나면 비교 중이던 상태를 초기화 — 비교는 화면별로 독립적으로 유지됨
  useEffect(() => {
    return () => {
      resetCompare();
    };
  }, [resetCompare]);

  const handleSelect = (codes: string[], names: string[]) => {
    setSelectedCountries(codes.map((code, i) => ({ code, name: names[i] })));
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

  const handleSearch = () => {
    setKeyword(input);
  };

  // 필터 전체 초기화
  const handleReset = () => {
    setInput('');
    setKeyword('');
    setSelectedCountries([]);
    setSelectedOptions({});
    setResetKey(prev => prev + 1);
  };

  const reportCity = reportCityName ? cities.find(c => c.name === reportCityName) : null;
  const reportData = reportCity
    ? buildCityReportData({
        cityId: String(reportCity.cityId),
        cityName: reportCity.name,
        // 검색으로 들어오면 목적을 고르는 단계가 없어 표시할 값이 없다
        purposeName: activePurpose?.name,
        imageUrl: reportCity.imageUrl,
        rating: reportCity.rating,
        description: reportCity.description,
      })
    : null;

  /** 목적은 카테고리 탭에서 선택된 목적(activePurpose)을 그대로 사용 — 검색 진입(isFromSearch)에는 목적이 없어 추가할 수 없음 */
  const handleAddToRoadmap = async () => {
    const city = cities.find(c => c.name === reportCityName);
    if (!city || createRoadmapMutation.isPending) return;
    const purposeId = activePurpose?.purposeId;
    if (purposeId == null) {
      setAddErrorMessage('이 도시의 목적 정보가 없어 로드맵을 만들 수 없어요.');
      return;
    }
    setAddErrorMessage(null);
    try {
      const result = await createRoadmapMutation.mutateAsync({ cityId: city.cityId, purposeId });
      setReportCityName(null);
      setAddedRoadmap({ roadmapId: result.roadmapId, cityName: city.name });
    } catch (error) {
      console.error('로드맵 생성 실패', error);
      setAddErrorMessage(getErrorMessage(error, '로드맵을 만들지 못했어요. 잠시 후 다시 시도해주세요.'));
    }
  };

  /** 비교 모달에서 도시를 선택하면 모달을 닫고 그 도시의 AI 리포트로 이어줌 */
  const handleSelectCompareCity = (cityId: number) => {
    closeCompareModal();
    const matched = cities.find(c => c.cityId === cityId);
    setReportCityName(matched ? matched.name : null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-[30px]">
      <div className="w-[1064px]">
        <SmartBriefingFAB/>
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
                showIcon
              />
            </>
          )}
           {isFromSearch && (
              <p className="body-03 text-gray-500">총 {totalElements}개의 검색결과가 나왔어요</p>
            )}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <DetailDropDown selectedOptions={selectedOptions} onSelect={handleSelectOption} />
              <RegionDropDown
                key={`region-${resetKey}`}
                purposeType={activePurpose?.type}
                onSelect={handleSelect}
                onReset={() => setSelectedCountries([])}
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
          {selectedCountries.map(({ name, code }) => (
            <FilterChip
              key={code}
              label={name}
              onRemove={() => setSelectedCountries(prev => prev.filter(c => c.code !== code))}
            />
          ))}
        </div>
        {totalElements !== 0 ? (
          <>
            <div className="mt-11 grid grid-cols-2 gap-5">
              {cities.map(city => (
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
                  onToggleWish={() => handleToggleWish(city)}
                  onCompare={() => toggleCompare(city.cityId, city.name)}
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
      {reportData && reportCity && (
        <CityReportModal
          isOpen
          onClose={() => { setReportCityName(null); setAddErrorMessage(null); }}
          data={reportData}
          onSearch={question => cityAiReportApi.askQuestion(reportCity.cityId, { question })}
          onAddToRoadmap={handleAddToRoadmap}
          isAddDisabled={createRoadmapMutation.isPending}
          addErrorMessage={addErrorMessage}
        />
      )}
      {addedRoadmap && (
        <RoadmapAddedToast
          cityName={addedRoadmap.cityName}
          onViewRoadmap={() => { navigate(`/myhome/dashboard/${addedRoadmap.roadmapId}`); setAddedRoadmap(null); }}
          onClose={() => setAddedRoadmap(null)}
        />
      )}
      <CompareSelectionBar cities={CITY_INSIGHT_CARDS} />
      <CompareModal onSelectCity={handleSelectCompareCity} />
    </div>
  );
}
