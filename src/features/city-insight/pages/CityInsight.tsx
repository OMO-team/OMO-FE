
// react
import { useEffect, useMemo, useRef, useState } from 'react';
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
import { useAllCountries as useAllCountriesByPurpose } from '../../home/hooks/useAllCountries';
import { useCities } from '../hooks/useCities';
import { useAllCountries } from '../hooks/useAllCountries';
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
  PurposeType, 
  StayDurationType 
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
import checkConditionIcon from '../../../assets/icons/icon-check-condition.svg';

// 국가 필터는 채팅에서 넘어오든 카테고리 탭에서 직접 고르든 브라우저 세션 동안 유지된다
const SELECTED_COUNTRIES_STORAGE_KEY = 'omo:cityInsight:selectedCountries';

function loadStoredCountries(): { name: string; code: string }[] {
  try {
    const raw = sessionStorage.getItem(SELECTED_COUNTRIES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredCountries(countries: { name: string; code: string }[]) {
  try {
    sessionStorage.setItem(SELECTED_COUNTRIES_STORAGE_KEY, JSON.stringify(countries));
  } catch {
    // 프라이빗 모드 등 sessionStorage 접근 불가 환경에서는 조용히 무시
  }
}

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

// 위 맵의 역방향 — 문장형 검색으로 들어온 파싱값을 상세필터 드롭다운의 선택 상태로 되돌리는 데 사용
const REVERSE_MONTHLY_COST_MAP: Record<number, string> = Object.fromEntries(
  Object.entries(MONTHLY_COST_MAP).map(([label, value]) => [value, label])
);
const REVERSE_SAFETY_SCORE_MAP: Record<number, string> = Object.fromEntries(
  Object.entries(SAFETY_SCORE_MAP).map(([label, value]) => [value, label])
);
const REVERSE_DIFFICULTY_MAP: Record<DifficultyType, string> = Object.fromEntries(
  Object.entries(DIFFICULTY_MAP).map(([label, value]) => [value, label])
) as Record<DifficultyType, string>;
const REVERSE_STAY_DURATION_MAP: Record<StayDurationType, string> = Object.fromEntries(
  Object.entries(STAY_DURATION_MAP).map(([label, value]) => [value, label])
) as Record<StayDurationType, string>;

/** 문장형 검색(AI 스마트 브리핑 포함)에서 파싱된 조건을 상세필터 드롭다운의 초기 선택값으로 변환 —
 *  드롭다운 트리거 자체는 라벨 고정이라 값이 바뀌지 않지만, 패널을 열었을 때 해당 옵션이 강조 표시된다.
 *  정규식으로 뽑힌 값이 프리셋 옵션(150/200/300 등)과 정확히 일치하지 않으면 표시만 생략되고
 *  필터링 자체는 base 파라미터로 그대로 적용된다 */
function buildInitialSelectedOptions(params?: CityQueryParams): Record<string, string> {
  if (!params) return {};
  const result: Record<string, string> = {};
  if (params.maxMonthlyCost !== undefined && REVERSE_MONTHLY_COST_MAP[params.maxMonthlyCost]) {
    result['월 생활비'] = REVERSE_MONTHLY_COST_MAP[params.maxMonthlyCost];
  }
  if (params.minSafetyScore !== undefined && REVERSE_SAFETY_SCORE_MAP[params.minSafetyScore]) {
    result['치안'] = REVERSE_SAFETY_SCORE_MAP[params.minSafetyScore];
  }
  if (params.housingDifficulty) {
    result['숙소 난이도'] = REVERSE_DIFFICULTY_MAP[params.housingDifficulty];
  }
  if (params.visaDifficulty) {
    result['비자 난이도'] = REVERSE_DIFFICULTY_MAP[params.visaDifficulty];
  }
  if (params.stayDuration) {
    result['체류 기간'] = REVERSE_STAY_DURATION_MAP[params.stayDuration];
  }
  return result;
}

const PURPOSE_LABELS: Record<PurposeType, string> = {
  WORKING_HOLIDAY: '워킹홀리데이',
  EXCHANGE_STUDENT: '교환학생',
  INTERNSHIP: '인턴십',
};

/** 파싱된 조건을 결과 화면 상단 'AI가 적용한 조건' 칩 문구로 변환 — 국가/지역은 selectedCountries
 *  칩으로 이미 따로 보여지므로 여기서는 다루지 않는다 */
function buildAppliedConditionLabels(parsed: ParsedSearchQuery): string[] {
  const { params } = parsed;
  const labels: string[] = [];
  if (params.purposeType) labels.push(PURPOSE_LABELS[params.purposeType]);
  if (params.maxMonthlyCost !== undefined) labels.push(`예산 ${params.maxMonthlyCost}만원 이하`);
  if (params.minSafetyScore !== undefined) labels.push(`치안 ${params.minSafetyScore}점 이상`);
  if (params.housingDifficulty) labels.push(`숙소 난이도 ${REVERSE_DIFFICULTY_MAP[params.housingDifficulty]}`);
  if (params.visaDifficulty) labels.push(`비자 난이도 ${REVERSE_DIFFICULTY_MAP[params.visaDifficulty]}`);
  if (params.stayDuration) labels.push(`체류 기간 ${REVERSE_STAY_DURATION_MAP[params.stayDuration]}`);
  if (parsed.minLanguageScore !== undefined) labels.push('영어 소통 가능');
  if (parsed.minInfraScore !== undefined) labels.push('인프라 우수');
  if (parsed.minRating !== undefined) labels.push('평점 우수');
  return labels;
}

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

  const locationState = location.state as
    | {
        recommendedCities?: CitySummary[];
        parsedSearch?: { query: string; conditionLabels?: string[] } & ParsedSearchQuery;
      }
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
  const [page, setPage] = useState(1);
  const [selectedCountries, setSelectedCountries] = useState<{ name: string; code: string }[]>(() =>
    loadStoredCountries()
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    buildInitialSelectedOptions(parsedSearch?.params)
  );
  const [resetKey, setResetKey] = useState(0);
  const [prevUrlKeyword, setPrevUrlKeyword] = useState(urlKeyword);
  /** 헤더에서 새로 전역 검색을 하면 같은 화면(컴포넌트)이 재사용되어 이전 검색의 필터가
   *  그대로 남는다 — 지역 코드가 남아있으면 새 검색어와 무관한 국가로 걸러져 결과가
   *  아예 안 뜨는 문제가 생기므로, 검색어 자체가 바뀌면 필터를 전부 초기화한다.
   *  selectedCountries는 세션에도 저장되므로(loadStoredCountries) 여기서 지울 때도
   *  같이 비워야, 새로고침해도 옛 검색의 국가 필터가 되살아나지 않는다 */
  if (prevUrlKeyword !== urlKeyword) {
    setPrevUrlKeyword(urlKeyword);
    setInput(urlKeyword);
    setKeyword(urlKeyword);
    setSelectedCountries([]);
    saveStoredCountries([]);
    setSelectedOptions({});
    setResetKey(prev => prev + 1);
  }
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

  // 문장형 검색(AI 브리핑 포함)에 국가/대륙이 언급됐는지 확인하려면 목적 무관 전체 국가 목록이 필요
  const { data: parsedSearchCountries = [] } = useAllCountries(isFromParsedSearch);
  const appliedCountryMatchRef = useRef(false);

  // /city-insight에 있는 상태에서 채팅으로 "추천 도시 보러가기"를 다시 누르면 같은 라우트라
  // CityInsight가 리마운트되지 않아 selectedOptions/국가 매칭이 이전 질의 값에 멈춰 있을 수 있다 —
  // parsedSearch(location.state)가 바뀔 때마다 상세필터·국가 매칭을 새 질의 기준으로 다시 계산한다
  const [prevParsedSearch, setPrevParsedSearch] = useState(parsedSearch);
  if (prevParsedSearch !== parsedSearch) {
    setPrevParsedSearch(parsedSearch);
    setSelectedOptions(buildInitialSelectedOptions(parsedSearch?.params));
    appliedCountryMatchRef.current = false;
  }

  useEffect(() => {
    if (!isFromParsedSearch || appliedCountryMatchRef.current || parsedSearchCountries.length === 0)
      return;
    appliedCountryMatchRef.current = true;

    const queryText = parsedSearch!.query;
    const matchedCountries = parsedSearchCountries.filter(c => queryText.includes(c.name));

    // 질의에 특정 국가명이 언급되면 그 국가(들)만 칩으로 교체한다. 대륙(예: 유럽)만 언급된 경우는
    // 대륙 전체 국가를 칩으로 늘어놓지 않는다 — 대륙 필터는 params.continent로 이미 그대로 적용되고
    // (queryParams에서 API에 전달), 화면 표시는 'AI가 적용한 조건' 칩의 텍스트로 대신한다.
    // 국가 언급이 아예 없으면 세션에 저장된 기존 필터를 그대로 둔다(초기값)
    if (matchedCountries.length > 0) {
      const next = matchedCountries.map(c => ({ name: c.name, code: c.code }));
      setSelectedCountries(next);
      saveStoredCountries(next);
    }
  }, [isFromParsedSearch, parsedSearchCountries, parsedSearch]);

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

  /** 목적이 정해지지 않은 진입(전역 검색 등)은 RegionDropDown이 목적별 국가 목록을
   *  가져오지 못해 패널이 비어 보인다 — 목적별 국가 목록을 모두 합쳐 그 대신 넘겨주고,
   *  검색 결과에 실린 국가를 찾는 이름→코드 매핑에도 함께 쓴다 */
  const regionPurposeType = activePurpose?.type ?? parsedSearch?.params.purposeType;
  const { countries: allCountries } = useAllCountriesByPurpose(purposes, { enabled: !regionPurposeType });
  const countryNameToCode = useMemo(
    () => new Map(allCountries.map(c => [c.name, c.code])),
    [allCountries]
  );

  /** 새로 들어온 검색어당 한 번만 자동 적용 — 그래야 사용자가 필터를 직접 지우거나
   *  바꾼 뒤에 결과가 재계산되어도 그 선택을 덮어쓰지 않는다. prevUrlKeyword와 같은 방식으로
   *  렌더 중에 바로 반영해, 이펙트에서 setState를 호출해 생기는 불필요한 리렌더를 피한다.
   *  keyword === urlKeyword로 위 검색어 전환 리셋이 이미 반영된 렌더인지 확인한다 —
   *  그렇지 않으면 검색어가 막 바뀐 시점에 이전 검색어로 캐시된 결과를 읽어 옛 국가를
   *  다시 선택해버리고, 그 값을 "이미 처리함"으로 표시해 새 검색어의 진짜 결과가 와도
   *  다시는 반영되지 않는다 */
  const [autoSelectedKeyword, setAutoSelectedKeyword] = useState<string | null>(null);
  if (
    isFromSearch &&
    keyword === urlKeyword &&
    autoSelectedKeyword !== urlKeyword &&
    searchFilteredCombinations.length > 0
  ) {
    const names = Array.from(new Set(searchFilteredCombinations.map(c => c.country.name)));
    const matched = names
      .map(name => ({ name, code: countryNameToCode.get(name) }))
      .filter((c): c is { name: string; code: string } => !!c.code);
    if (matched.length > 0) {
      setAutoSelectedKeyword(urlKeyword);
      setSelectedCountries(matched);
    }
  }

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
    const next = codes.map((code, i) => ({ code, name: names[i] }));
    setSelectedCountries(next);
    saveStoredCountries(next);
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

  /** 필터 초기화 — 전역 검색으로 들어온 화면은 검색어 자체와 거기서 자동으로 체크된
   *  지역 칩까지가 "검색 결과"다. 여기서 keyword나 selectedCountries를 지우면 검색
   *  결과 자체가 바뀌어버리므로, 검색 위에 얹은 상세 필터(월 생활비 등)만 초기화한다.
   *  목적/국가를 고르고 들어온 도시 탐색 화면(isFromCountry)에서는 전부 지운다 */
  const handleReset = () => {
    if (!isFromSearch) {
      setInput('');
      setKeyword('');
      setSelectedCountries([]);
      saveStoredCountries([]);
    }
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

  // 결과 화면 상단 'AI가 적용한 조건' 칩 — AI 채팅에서 넘어온 경우 채팅에 떴던 태그 문구("치안 우수" 등)를
  // 그대로 쓰고, 태그가 없는 문장형 검색(전역 검색)은 파싱된 조건에서 문구를 새로 만든다.
  // (사용자가 이후 상세필터를 직접 바꿔도 이 칩은 최초 해석 결과를 유지)
  const appliedConditionLabels = isFromParsedSearch
    ? [
        ...(parsedSearch!.conditionLabels ?? buildAppliedConditionLabels(parsedSearch!)),
        // 대륙만 언급되고 특정 국가는 안 나온 경우 — 국가 칩으로는 안 늘어놓으니 여기 텍스트로 표시
        ...(parsedSearch!.params.continent && selectedCountries.length === 0
          ? [`지역 ${parsedSearch!.params.continent}`]
          : []),
      ]
    : [];

  return (
    <div className="w-full flex flex-col items-center justify-center mt-[30px] px-[clamp(32px,50vw_-_451.5px,188px)]">
      <div className="w-full max-w-[1064px]">
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
                    width="w-full max-w-[974px]"
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
              {appliedConditionLabels.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="body-05 text-gray-500">AI가 적용한 조건</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {appliedConditionLabels.map(label => (
                      <div
                        key={label}
                        className="flex items-center justify-center gap-1 rounded-2 bg-primary-50"
                        style={{ padding: '4px 10px 4px 8px' }}
                      >
                        <div className="size-icon-sm flex items-center justify-center flex-shrink-0">
                          <img src={checkConditionIcon} alt="체크" width={14} height={10} />
                        </div>
                        <span className="body-04 text-primary-700">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <DetailDropDown selectedOptions={selectedOptions} onSelect={handleSelectOption} />
                  <RegionDropDown
                    key={`region-${resetKey}`}
                    purposeType={regionPurposeType}
                    countries={regionPurposeType ? undefined : allCountries}
                    value={selectedCountries}
                    onSelect={handleSelect}
                    onReset={() => {
                      setSelectedCountries([]);
                      saveStoredCountries([]);
                    }}
                  />
                  <div className="w-px h-7 bg-gray-300 hidden sm:block"></div>
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
                <button className="flex shrink-0 items-center gap-1" onClick={handleReset}>
                  <p className="body-03 text-gray-400">필터 초기화</p>
                  <img src={filterResetIcon} alt="" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
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
            <div className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
              <div className="mb-[clamp(80px,20vw,304px)]" />
            ) : (
              <div className="mt-[clamp(48px,10vw,100px)] mb-[clamp(80px,20vw,304px)]">
                <PageNavigation currentPage={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-[30px] items-center mt-[clamp(80px,20vw,298px)] mb-[clamp(80px,20vw,295px)]">
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