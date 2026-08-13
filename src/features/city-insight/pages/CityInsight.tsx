// react
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
import type { CitySummary } from '../../chat/types/dto';

// stores
import { useCompareStore } from '../../compare/store/useCompareStore';

// utils
import { buildCityReportData } from '../../roadmap/utils/buildCityReportData';
import {
  hasStructuredCondition,
  hasClientOnlyCondition,
  matchesClientOnlyCondition,
  type ParsedSearchQuery,
} from '../utils/parseSearchQuery';

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

/** 스마트 브리핑의 "추천 도시 보러가기"로 들어온 도시들 — 목적(purpose) 필터 기준 카탈로그 API로는 조회할 수 없어
 *  AI 응답에 실려온 데이터를 그대로 카드로 그린다. infraScore는 응답에서 종종 누락되어 오므로(백엔드 확인됨) 0으로 대체한다 */
function adaptSummaryToCityItem(city: CitySummary): CityItem {
  return {
    cityId: city.cityId,
    name: city.cityName,
    country: { countryId: 0, name: city.countryName },
    continent: '',
    imageUrl: city.imageUrl,
    rating: city.rating,
    description: '',
    monthlyCost: city.monthlyCost,
    safetyScore: city.safetyScore,
    housingScore: city.housingScore,
    visaScore: city.visaScore,
    languageScore: city.languageScore,
    internetScore: city.infraScore ?? 0,
    stayDuration: 'SHORT',
    isWishlisted: false,
  };
}

export default function CityInsight() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlKeyword = searchParams.get('keyword') ?? '';
  const urlCountryCodes = searchParams.getAll('countryCodes');
  const locationState = location.state as
    | { recommendedCities?: CitySummary[]; parsedSearch?: { query: string } & ParsedSearchQuery }
    | null;
  const recommendedCities = locationState?.recommendedCities;
  const parsedSearch = locationState?.parsedSearch;

  // 진입 경로 판단 — keyword / countryCodes / AI 추천 도시 / 문장형 구조화 검색은 상호 배타적으로 처리
  const isFromRecommendation = !!recommendedCities?.length;
  const isFromParsedSearch = !isFromRecommendation && !!parsedSearch;
  const isFromSearch = !isFromRecommendation && !isFromParsedSearch && !!urlKeyword;
  const isFromCountry = !isFromSearch && !isFromRecommendation && !isFromParsedSearch;

  /** 검색창이 조건을 하나도 못 뽑아냈으면 애초에 parsedSearch 대신 keyword로 보내지만, 방어적으로
   *  한 번 더 확인 — 비어 있으면 필터 없는 전체 목록 대신 "조건을 이해하지 못했다" 안내로 처리 */
  const hasParsedFilters = isFromParsedSearch && hasStructuredCondition(parsedSearch!);

  const { data: purposes = [] } = usePurposes({
    enabled: !isFromSearch && !isFromRecommendation && !isFromParsedSearch,
  });

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

  const activePurpose = purposes[activeIndex];

  const queryParams = useMemo<CityQueryParams>(() => {
    const currentCountryCodes = searchParams.getAll('countryCodes');
    const selectedCodes = selectedCountries.map(c => c.code);
    const activeCodes = selectedCodes.length > 0 ? selectedCodes : currentCountryCodes;

    if (isFromParsedSearch) {
      const base = parsedSearch!.params;
      return {
        ...base,
        countryCodes: activeCodes.length > 0 ? activeCodes : undefined,
        // 상세필터에서 직접 값을 고르면(상관없음 포함) 문장에서 파싱된 값을 덮어씀 — 드롭다운을
        // 아예 건드리지 않았을 때만 파싱된 기본값을 그대로 씀
        maxMonthlyCost:
          '월 생활비' in selectedOptions ? MONTHLY_COST_MAP[selectedOptions['월 생활비']] : base.maxMonthlyCost,
        minSafetyScore:
          '치안' in selectedOptions ? SAFETY_SCORE_MAP[selectedOptions['치안']] : base.minSafetyScore,
        housingDifficulty:
          '숙소 난이도' in selectedOptions ? DIFFICULTY_MAP[selectedOptions['숙소 난이도']] : base.housingDifficulty,
        visaDifficulty:
          '비자 난이도' in selectedOptions ? DIFFICULTY_MAP[selectedOptions['비자 난이도']] : base.visaDifficulty,
        stayDuration:
          '체류 기간' in selectedOptions ? STAY_DURATION_MAP[selectedOptions['체류 기간']] : base.stayDuration,
      };
    }

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
  }, [keyword, isFromSearch, isFromParsedSearch, parsedSearch, activePurpose, selectedCountries, searchParams, selectedOptions]);

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

  // activePurpose는 이전 방문에서 캐시된 값이 남아있을 수 있어(usePurposes가 비활성이어도 캐시는 유지됨),
  // 문장형 검색 모드에서는 그 값을 절대 신뢰하지 않고 hasParsedFilters로만 판단한다
  const shouldFetchCities = isFromSearch
    ? true
    : isFromParsedSearch
      ? hasParsedFilters
      : !!activePurpose;

  /** 어학·인프라·평점처럼 /api/v1/cities에 필터 파라미터가 없는 조건이 있는 문장형 검색은
   *  (키워드 검색처럼) 전체 매칭 결과를 다 받아와 프론트에서 다시 걸러낸 뒤 페이지네이션해야
   *  진짜 AND 교집합이 됨 — 조건 목록은 parseSearchQuery.ts의 hasClientOnlyCondition 참고 */
  const needsClientRefilter =
    isFromSearch || (isFromParsedSearch && hasClientOnlyCondition(parsedSearch!));

  const { data: citiesResult } = useCities(needsClientRefilter ? queryParams : apiParams, {
    enabled: !isFromRecommendation && shouldFetchCities,
    fetchAll: needsClientRefilter,
  });

  const rawCities = isFromRecommendation
    ? recommendedCities!.map(adaptSummaryToCityItem)
    : citiesResult?.data ?? [];

  const searchMatchedCities = isFromSearch
    ? // 전역 검색은 백엔드가 도시명·국가명뿐 아니라 한줄 요약(description)까지 매칭해 결과를 주므로,
      // 요약 문구에서만 걸린 카드는 빼고(도시명 또는 국가명 매칭만 남기고) 다시 걸러낸다
      rawCities.filter(c => {
        const q = keyword.trim().toLowerCase();
        return c.name.toLowerCase().includes(q) || c.country.name.toLowerCase().includes(q);
      })
    : isFromParsedSearch
      ? rawCities.filter(c => matchesClientOnlyCondition(c, parsedSearch!))
      : rawCities;

  const cities = needsClientRefilter
    ? searchMatchedCities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : searchMatchedCities;

  const totalElements = isFromRecommendation
    ? cities.length
    : needsClientRefilter
      ? searchMatchedCities.length
      : citiesResult?.totalElements ?? 0;
  const totalPages = isFromRecommendation
    ? 1
    : needsClientRefilter
      ? Math.max(1, Math.ceil(searchMatchedCities.length / PAGE_SIZE))
      : Math.max(1, citiesResult?.totalPages ?? 1);

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
          <div className={`mb-6 ${isFromSearch || isFromParsedSearch ? 'border-b border-gray-200 pb-[30px]' : ''}`}>
            {isFromSearch || isFromParsedSearch ? (
              <h1 className="heading-05">
                <span className="text-blue-500">'{isFromParsedSearch ? parsedSearch!.query : urlKeyword}'</span>에 대한 검색 결과
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
        {!isFromRecommendation && (
          <>
            <div className="flex flex-col gap-4">
              {!isFromSearch && !isFromParsedSearch && (
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
               {(isFromSearch || isFromParsedSearch) && (
                  <p className="body-03 text-gray-500">총 {totalElements}개의 검색결과가 나왔어요</p>
                )}
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <DetailDropDown selectedOptions={selectedOptions} onSelect={handleSelectOption} />
                  <RegionDropDown
                    key={`region-${resetKey}`}
                    purposeType={activePurpose?.type ?? parsedSearch?.params.purposeType}
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
          </>
        )}
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
            {isFromRecommendation ? (
              <div className="mb-[304px]" />
            ) : (
              <div className="mt-25 mb-[304px]">
                <PageNavigation
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-[30px] items-center mt-[298px] mb-[295px]">
            <div className="w-[70px] h-[70px] bg-[#F1F8FF] flex justify-center items-center rounded-full">
              <FilterIcon width={42} height={42} />
            </div>
            <div className="flex flex-col gap-2 items-center">
              <h1 className="heading-05 text-gray-600">
                {isFromParsedSearch && !hasParsedFilters
                  ? '검색어에서 조건을 이해하지 못했어요.'
                  : '조건에 맞는 도시가 없습니다.'}
              </h1>
              <p className="title-03 text-gray-300">
                {isFromParsedSearch && !hasParsedFilters
                  ? '치안, 예산, 대륙, 목적(워킹홀리데이 등)을 조금 더 구체적으로 적어보세요.'
                  : '필터를 완화하면 더 많은 도시를 볼 수 있어요.'}
              </p>
            </div>
            {!isFromParsedSearch && (
              <button
                className="bg-blue-100 text-blue-400 px-[26px] py-3 title-02 rounded-[12px] hover:bg-[#9FD2FF]"
                onClick={handleReset}
              >
                필터 초기화 하기
              </button>
            )}
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
