import { useQueries } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CitiesResponse, CityItem, CityQueryParams, PurposeType } from '../types/cityInsight';
import type { Purpose } from '../../home/types/home';

/**
 * 검색 결과 한 장 = 도시 하나가 아니라 "도시 + 목적" 조합 하나.
 * 로드맵은 도시와 목적을 묶어서 만들어지는데 검색에는 목적을 고르는 단계가 없어서,
 * 시드니처럼 세 목적을 다 지원하는 도시는 목적별로 카드를 나눠 보여준다.
 * 그래야 카드를 누른 시점에 어떤 목적으로 만들지가 이미 정해져 있다.
 */
export type CityPurposeCombination = CityItem & {
  /** 목적 후보에 들지 못한 도시는 목적이 없다 — 검색에는 뜨지만 로드맵으로 만들 수 없다 */
  purposeId?: number;
  purposeName?: string;
  purposeType?: PurposeType;
};

/** 조합을 구분하는 키 — 같은 도시가 목적 수만큼 나오므로 cityId만으로는 겹친다 */
export function combinationKey(cityId: number, purposeId?: number): string {
  return `${cityId}:${purposeId ?? ''}`;
}

/** 서버가 허용하는 페이지 크기 상한. 이보다 크게 요청하면 400으로 거절당한다 */
const FETCH_SIZE = 100;

/** 한 페이지가 100개를 넘을 수 없어서, 무한정 도는 일이 없도록 상한을 둔다 (도시 전체가 266개) */
const MAX_PAGES = 10;

async function fetchCitiesPage(params: CityQueryParams, page: number): Promise<CitiesResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries({ ...params, page, size: FETCH_SIZE }).filter(
      ([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)
    )
  );
  const { data } = await instance.get<ApiResponse<CitiesResponse>>('/api/v1/cities', {
    params: cleanParams,
    paramsSerializer: { indexes: null },
  });
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
}

/**
 * 조건에 맞는 도시를 끝까지 받아온다.
 * 목적별 결과를 합쳐서 다시 쪼개는 구조라 서버 페이지네이션을 그대로 쓸 수 없고,
 * 한 번만 받으면 100개에서 잘려 워킹홀리데이(109개) 같은 목적에서 도시가 누락된다.
 */
async function fetchAllCities(params: CityQueryParams): Promise<CityItem[]> {
  const cities: CityItem[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result = await fetchCitiesPage(params, page);
    cities.push(...result.data);
    if (!result.hasNext) break;
  }
  return cities;
}

/**
 * 목적별로 어떤 도시가 후보인지만 알면 되는 경우에 쓴다.
 * 스마트 브리핑은 추천 도시가 AI 응답에 실려와서 도시 목록 API로 다시 조회할 수 없다.
 * 그래서 목적별 후보 목록만 따로 받아 추천 도시와 맞춰보고 목적을 붙인다.
 */
export function usePurposeCityIdSets(purposes: Purpose[], options?: { enabled?: boolean }) {
  const enabled = (options?.enabled ?? true) && purposes.length > 0;

  const results = useQueries({
    queries: purposes.map((purpose) => ({
      queryKey: ['cities', 'purposeCityIds', purpose.type],
      staleTime: 1000 * 60 * 5,
      enabled,
      queryFn: () => fetchAllCities({ purposeType: purpose.type }),
    })),
  });

  /** purposeId -> 그 목적의 후보 도시 id 집합 */
  const sets = new Map<number, Set<number>>();
  results.forEach((result, index) => {
    sets.set(purposes[index].purposeId, new Set(result.data?.map((c) => c.cityId) ?? []));
  });

  return { sets, isLoading: results.some((r) => r.isLoading) };
}

/**
 * 목적별로 한 번씩, 목적 없이 한 번 조회해서 조합 목록을 만든다.
 * 목적 없는 조회가 따로 필요한 이유는, 어느 목적 후보에도 없는 도시(전체의 3분의 1)가
 * 목적별 조회에는 걸리지 않아 검색 결과에서 통째로 사라지기 때문이다.
 */
export function useCityPurposeCombinations(
  params: CityQueryParams,
  purposes: Purpose[],
  options?: { enabled?: boolean }
) {
  const enabled = (options?.enabled ?? true) && purposes.length > 0;

  const results = useQueries({
    queries: [undefined, ...purposes.map((p) => p.type)].map((purposeType) => ({
      queryKey: ['cities', 'combinations', { ...params, purposeType }],
      staleTime: 1000 * 60 * 5,
      enabled,
      queryFn: () => fetchAllCities({ ...params, purposeType }),
    })),
  });

  const [allResult, ...purposeResults] = results;
  const isLoading = results.some((r) => r.isLoading);

  const combinations: CityPurposeCombination[] = [];
  const citiesWithPurpose = new Set<number>();

  purposeResults.forEach((result, index) => {
    const purpose = purposes[index];
    result.data?.forEach((city) => {
      citiesWithPurpose.add(city.cityId);
      combinations.push({
        ...city,
        purposeId: purpose.purposeId,
        purposeName: purpose.name,
        purposeType: purpose.type,
      });
    });
  });

  // 목적이 하나도 없는 도시는 목적 없는 조합으로 한 장만 넣는다
  allResult.data?.forEach((city) => {
    if (!citiesWithPurpose.has(city.cityId)) combinations.push({ ...city });
  });

  /** 같은 도시의 카드끼리 흩어지지 않도록 도시 순으로 모으고, 그 안에서 목적 순서를 지킨다 */
  combinations.sort((a, b) => a.cityId - b.cityId || (a.purposeId ?? 0) - (b.purposeId ?? 0));

  return { combinations, isLoading };
}
