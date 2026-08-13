import { useQuery } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CityQueryParams, CitiesResponse } from '../types/cityInsight';

/** 명세상 허용되는 최대 페이지 크기 — fetchAll에서 요청 수를 줄이려고 최대치를 쓴다 */
const MAX_PAGE_SIZE = 100;

async function fetchCityPage(params: CityQueryParams): Promise<CitiesResponse> {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
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

export function useCities(
  params: CityQueryParams,
  options?: { enabled?: boolean; fetchAll?: boolean }
) {
  const fetchAll = options?.fetchAll ?? false;
  return useQuery({
    queryKey: ['cities', params, fetchAll],
    staleTime: 1000 * 60 * 5,
    // 언제 조회할지는 호출부가 온전히 결정한다 — 목적/키워드/국가 유무로 재차 게이트를 걸면
    // 문장형 검색처럼 그 셋 없이 생활비·치안 같은 조건만 있는 경우가 막혀버림
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<CitiesResponse> => {
      if (!fetchAll) return fetchCityPage(params);

      /** keyword 검색은 백엔드가 도시명+한줄요약을 함께 매칭해 페이지네이션 개수가 프론트 필터링과 안 맞으므로,
       *  전체 매칭 결과를 모아 호출부에서 다시 걸러내고 페이지네이션한다 */
      const firstPage = await fetchCityPage({ ...params, page: 0, size: MAX_PAGE_SIZE });
      if (firstPage.totalPages <= 1) return firstPage;

      const restPages = await Promise.all(
        Array.from({ length: firstPage.totalPages - 1 }, (_, i) =>
          fetchCityPage({ ...params, page: i + 1, size: MAX_PAGE_SIZE })
        )
      );
      return { ...firstPage, data: [firstPage, ...restPages].flatMap(p => p.data) };
    },
  });
}
