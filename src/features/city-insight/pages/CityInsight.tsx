// react
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
import { wishKey } from '../../roadmap/utils/wishlistAdapter';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { wishlistApi } from '../../roadmap/api/wishlistApi';
import { roadmapQueryKeys, wishlistQueryKeys } from '../../roadmap/api/queryKeys';
import { getErrorMessage } from '../../roadmap/api/apiUtils';
import RoadmapAddedToast from '../../roadmap/components/RoadmapAddedToast';
import CompareSelectionBar from '../../compare/components/CompareSelectionBar';
import CompareModal from '../../compare/components/CompareModal';

// hooks
import { usePurposes } from '../../home/hooks/usePurposes';
import { useCities } from '../hooks/useCities';
import {
  useCityPurposeCombinations,
  usePurposeCityIdSets,
  combinationKey,
  type CityPurposeCombination,
} from '../hooks/useCityPurposeCombinations';

// utils
import { adaptCityToCardProps } from '../utils/cityAdapter';

// types
import type {
  CityItem,
  CityQueryParams,
  DifficultyType,
  StayDurationType,
} from '../types/cityInsight';
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
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);
  const openModal = useAuthStore(s => s.openModal);

  /**
   * 이미 로드맵이 있는 도시+목적 조합은 다시 담지 못하게 막는다.
   * 백엔드가 같은 조합을 거부하는데 409가 아니라 500으로 떨어져서, 누르기 전에 걸러야 한다.
   * 내 홈과 같은 쿼리 키를 써서 이미 받아둔 목록이 있으면 그대로 재사용한다.
   */
  const { data: myRoadmaps = [] } = useQuery({
    queryKey: roadmapQueryKeys.list(isLoggedIn),
    queryFn: roadmapsApi.list,
  });
  const roadmapKeys = useMemo(
    () => new Set(myRoadmaps.map(item => wishKey(item.cityId, item.purposeId))),
    [myRoadmaps]
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const urlKeyword = searchParams.get('keyword') ?? '';
  const urlCountryCodes = searchParams.getAll('countryCodes');
  const urlCountryCodesKey = urlCountryCodes.join(',');

  const locationState = location.state as {
    recommendedCities?: CitySummary[];
    parsedSearch?: { query: string } & ParsedSearchQuery;
  } | null;
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

  const { data: purposes = [] } = usePurposes();

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
  /** 같은 도시가 목적 수만큼 나오므로 이름이 아니라 도시+목적 키로 어떤 카드를 열었는지 기억한다 */
  const [reportKey, setReportKey] = useState<string | null>(null);
  const [addedRoadmap, setAddedRoadmap] = useState<{ roadmapId: number; cityName: string } | null>(
    null
  );
  const [addErrorMessage, setAddErrorMessage] = useState<string | null>(null);
  const toggleCompare = useCompareStore(s => s.toggleCompare);
  const resetCompare = useCompareStore(s => s.resetCompare);
  const closeCompareModal = useCompareStore(s => s.closeModal);

  /**
   * 목적 탭은 국가로 들어온 경로에만 있다. 검색·추천에는 고르는 단계가 없어 선택된 목적도 없고,
   * 여기서 걸러주지 않으면 목록의 첫 목적(워킹홀리데이)이 선택된 것처럼 잡힌다.
   * 그 경로들은 대신 결과를 목적별 카드로 나눠서, 카드마다 목적이 정해진 상태로 다룬다.
   */
  const activePurpose = isFromSearch || isFromRecommendation ? undefined : purposes[activeIndex];

  const queryParams = useMemo<CityQueryParams>(() => {
    const selectedCodes = selectedCountries.map(c => c.code);
    const activeCodes =
      selectedCodes.length > 0
        ? selectedCodes
        : urlCountryCodesKey
          ? urlCountryCodesKey.split(',')
          : [];

    if (isFromParsedSearch) {
      const base = parsedSearch!.params;
      return {
        ...base,
        countryCodes: activeCodes.length > 0 ? activeCodes : undefined,
        // 상세필터에서 직접 값을 고르면(상관없음 포함) 문장에서 파싱된 값을 덮어씀 — 드롭다운을
        // 아예 건드리지 않았을 때만 파싱된 기본값을 그대로 씀
        maxMonthlyCost:
          '월 생활비' in selectedOptions
            ? MONTHLY_COST_MAP[selectedOptions['월 생활비']]
            : base.maxMonthlyCost,
        minSafetyScore:
          '치안' in selectedOptions
            ? SAFETY_SCORE_MAP[selectedOptions['치안']]
            : base.minSafetyScore,
        housingDifficulty:
          '숙소 난이도' in selectedOptions
            ? DIFFICULTY_MAP[selectedOptions['숙소 난이도']]
            : base.housingDifficulty,
        visaDifficulty:
          '비자 난이도' in selectedOptions
            ? DIFFICULTY_MAP[selectedOptions['비자 난이도']]
            : base.visaDifficulty,
        stayDuration:
          '체류 기간' in selectedOptions
            ? STAY_DURATION_MAP[selectedOptions['체류 기간']]
            : base.stayDuration,
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
  }, [
    keyword,
    isFromSearch,
    isFromParsedSearch,
    parsedSearch,
    activePurpose,
    selectedCountries,
    urlCountryCodesKey,
    selectedOptions,
  ]);

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
    [queryParams, page]
  );

  // activePurpose는 이전 방문에서 캐시된 값이 남아있을 수 있어(usePurposes가 비활성이어도 캐시는 유지됨),
  // 문장형 검색 모드에서는 그 값을 절대 신뢰하지 않고 hasParsedFilters로만 판단한다
  // 전역 키워드 검색(isFromSearch)은 useCityPurposeCombinations가 따로 전체 조회하므로 여기서는 조회하지 않는다
  const shouldFetchCities = isFromParsedSearch ? hasParsedFilters : !!activePurpose;

  /** 어학·인프라·평점처럼 /api/v1/cities에 필터 파라미터가 없는 조건이 있는 문장형 검색은
   *  전체 매칭 결과를 다 받아와 프론트에서 다시 걸러낸 뒤 페이지네이션해야
   *  진짜 AND 교집합이 됨 — 조건 목록은 parseSearchQuery.ts의 hasClientOnlyCondition 참고 */
  const needsClientRefilter = isFromParsedSearch && hasClientOnlyCondition(parsedSearch!);

  const { data: citiesResult } = useCities(needsClientRefilter ? queryParams : apiParams, {
    enabled: !isFromRecommendation && shouldFetchCities,
    fetchAll: needsClientRefilter,
  });

  // 검색은 목적별로 나눠 받아 합치므로 서버 페이지네이션을 쓸 수 없다 — 전부 받아 여기서 자른다
  const { combinations } = useCityPurposeCombinations(queryParams, purposes, {
    enabled: isFromSearch,
  });

  /** 전역 키워드 검색 필터링 — 백엔드는 keyword를 도시명/국가명/한줄요약(description)에 한꺼번에
   *  매칭해 내려주므로, 프론트에서 어떤 필드에 걸렸는지 우선순위(도시명 > 국가명 > 설명)를 매겨
   *  하나의 기준으로만 다시 걸러낸다. 도시별 목적 카드(워킹홀리데이/교환학생/인턴십)는 이미
   *  combinations 단계에서 나뉘어 있어, 도시 단위로 필터링해도 3장이 함께 남거나 함께 빠진다 */
  const searchFilteredCombinations = useMemo(() => {
    if (!isFromSearch) return combinations;
    const q = keyword.trim().toLowerCase();
    const nameMatches = combinations.filter(c => c.name.toLowerCase().includes(q));
    if (nameMatches.length > 0) return nameMatches;
    const countryMatches = combinations.filter(c => c.country.name.toLowerCase().includes(q));
    if (countryMatches.length > 0) return countryMatches;
    return combinations.filter(c => c.description.toLowerCase().includes(q));
  }, [isFromSearch, combinations, keyword]);

  // 추천 도시는 AI 응답에 실려와서 목적을 모른다 — 목적별 후보 목록과 맞춰보고 붙인다
  const { sets: purposeCityIdSets } = usePurposeCityIdSets(purposes, {
    enabled: isFromRecommendation,
  });
  const recommendedCombinations = useMemo<CityPurposeCombination[]>(() => {
    if (!isFromRecommendation) return [];
    return recommendedCities!.flatMap(summary => {
      const city = adaptSummaryToCityItem(summary);
      const matched = purposes.filter(p => purposeCityIdSets.get(p.purposeId)?.has(city.cityId));
      // 어느 목적 후보에도 없으면 목적 없는 카드 한 장으로 둔다
      if (matched.length === 0) return [city];
      return matched.map(p => ({
        ...city,
        purposeId: p.purposeId,
        purposeName: p.name,
        purposeType: p.type,
      }));
    });
  }, [isFromRecommendation, recommendedCities, purposes, purposeCityIdSets]);

  const rawCities = isFromRecommendation
    ? recommendedCities!.map(adaptSummaryToCityItem)
    : (citiesResult?.data ?? []);

  const searchMatchedCities = isFromParsedSearch
    ? rawCities.filter(c => matchesClientOnlyCondition(c, parsedSearch!))
    : rawCities;

  const cities: CityPurposeCombination[] = isFromRecommendation
    ? recommendedCombinations
    : isFromSearch
      ? searchFilteredCombinations.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      : needsClientRefilter
        ? searchMatchedCities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        : searchMatchedCities;

  const totalElements = isFromRecommendation
    ? cities.length
    : isFromSearch
      ? searchFilteredCombinations.length
      : needsClientRefilter
        ? searchMatchedCities.length
        : (citiesResult?.totalElements ?? 0);

  const totalPages = isFromRecommendation
    ? 1
    : isFromSearch
      ? Math.max(1, Math.ceil(searchFilteredCombinations.length / PAGE_SIZE))
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
  const handleToggleWish = (city: CityPurposeCombination) => {
    // 목적 탭이 있는 경로는 탭 선택을, 검색은 카드에 붙은 목적을 쓴다
    const purposeId = activePurpose?.purposeId ?? city.purposeId;
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

  const reportCity = reportKey
    ? cities.find(c => combinationKey(c.cityId, c.purposeId) === reportKey)
    : null;
  const reportData = reportCity
    ? buildCityReportData({
        cityId: String(reportCity.cityId),
        cityName: reportCity.name,
        purposeName: activePurpose?.name ?? reportCity.purposeName,
        imageUrl: reportCity.imageUrl,
        rating: reportCity.rating,
        description: reportCity.description,
      })
    : null;

  /** 목적은 탭에서 고른 값(activePurpose)을, 검색이면 카드에 붙은 목적을 쓴다 */
  const handleAddToRoadmap = async () => {
    if (!isLoggedIn) {
      openModal('loginRequired');
      return;
    }
    const city = reportCity;
    if (!city || createRoadmapMutation.isPending) return;
    const purposeId = activePurpose?.purposeId ?? city.purposeId;
    if (purposeId == null) {
      // 어느 목적 후보에도 들지 않은 도시 — 검색에는 뜨지만 로드맵으로는 만들 수 없다
      setAddErrorMessage('아직 준비 목적이 정해지지 않은 도시라 로드맵을 만들 수 없어요.');
      return;
    }
    setAddErrorMessage(null);
    try {
      const result = await createRoadmapMutation.mutateAsync({ cityId: city.cityId, purposeId });
      setReportKey(null);
      setAddedRoadmap({ roadmapId: result.roadmapId, cityName: city.name });
    } catch (error) {
      console.error('로드맵 생성 실패', error);
      setAddErrorMessage(
        getErrorMessage(error, '로드맵을 만들지 못했어요. 잠시 후 다시 시도해주세요.')
      );
    }
  };

  /** 비교 모달에서 도시를 선택하면 모달을 닫고 그 도시의 AI 리포트로 이어줌 */
  const handleSelectCompareCity = (cityId: number) => {
    closeCompareModal();
    // 비교는 도시 단위라 목적을 모른다 — 그 도시의 첫 조합(목적 순서상 가장 앞)을 연다
    const matched = cities.find(c => c.cityId === cityId);
    setReportKey(matched ? combinationKey(matched.cityId, matched.purposeId) : null);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-[30px]">
      <div className="w-[1064px]">
        <SmartBriefingFAB />
        {!isFromCountry && (
          <div
            className={`mb-6 ${isFromSearch || isFromParsedSearch ? 'border-b border-gray-200 pb-[30px]' : ''}`}
          >
            {isFromSearch || isFromParsedSearch ? (
              <h1 className="heading-05">
                <span className="text-blue-500">
                  '{isFromParsedSearch ? parsedSearch!.query : urlKeyword}'
                </span>
                에 대한 검색 결과
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
                    value={selectedCountries}
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
                  key={combinationKey(city.cityId, city.purposeId)}
                  imageUrl={city.imageUrl}
                  rating={city.rating}
                  isWishlisted={city.isWishlisted}
                  name={city.name}
                  countryName={city.country.name}
                  purposeName={city.purposeName}
                  description={city.description}
                  monthlyCost={city.monthlyCost}
                  safetyScore={city.safetyScore}
                  languageScore={city.languageScore}
                  internetScore={city.internetScore}
                  {...adaptCityToCardProps(city)}
                  onToggleWish={() => handleToggleWish(city)}
                  onCompare={() => toggleCompare(city.cityId, city.name)}
                  onReport={() => setReportKey(combinationKey(city.cityId, city.purposeId))}
                />
              ))}
            </div>
            {isFromRecommendation ? (
              <div className="mb-[304px]" />
            ) : (
              <div className="mt-25 mb-[304px]">
                <PageNavigation currentPage={page} totalPages={totalPages} onPageChange={setPage} />
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
          onClose={() => {
            setReportKey(null);
            setAddErrorMessage(null);
          }}
          data={reportData}
          onSearch={question => cityAiReportApi.askQuestion(reportCity.cityId, { question })}
          onAddToRoadmap={handleAddToRoadmap}
          isAddDisabled={
            createRoadmapMutation.isPending ||
            // 이미 로드맵이 있는 조합이면 "로드맵에 추가됨"으로 잠긴다
            roadmapKeys.has(
              wishKey(reportCity.cityId, activePurpose?.purposeId ?? reportCity.purposeId)
            )
          }
          addErrorMessage={addErrorMessage}
        />
      )}
      {addedRoadmap && (
        <RoadmapAddedToast
          cityName={addedRoadmap.cityName}
          onViewRoadmap={() => {
            navigate(`/myhome/dashboard/${addedRoadmap.roadmapId}`);
            setAddedRoadmap(null);
          }}
          onClose={() => setAddedRoadmap(null)}
        />
      )}
      <CompareSelectionBar cities={CITY_INSIGHT_CARDS} />
      <CompareModal onSelectCity={handleSelectCompareCity} />
    </div>
  );
}
