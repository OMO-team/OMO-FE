import { useQueries } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { Purpose, Country, CountriesResponse } from '../types/home';

/**
 * /api/v1/countries는 purposeType 없이는 조회할 수 없다. 목적과 무관하게 국가 이름→코드
 * 전체 매핑이 필요한 경우(예: 전역 검색 결과의 국가를 지역 필터에 반영)를 위해 목적별로
 * 모두 받아와 코드 기준으로 중복 제거해 합친다. queryKey가 useCountriesByPurpose와 같아
 * 캐시를 공유한다.
 */
export function useAllCountries(purposes: Purpose[], options?: { enabled?: boolean }) {
  const enabled = (options?.enabled ?? true) && purposes.length > 0;

  const results = useQueries({
    queries: purposes.map(purpose => ({
      queryKey: ['countries', purpose.type],
      enabled,
      queryFn: async (): Promise<Country[]> => {
        const { data } = await instance.get<ApiResponse<CountriesResponse>>('/api/v1/countries', {
          params: { purposeType: purpose.type },
        });
        if (!data.isSuccess) throw new Error(data.message);
        return data.result.countries;
      },
    })),
  });

  const byCode = new Map<string, Country>();
  results.forEach(result => {
    result.data?.forEach(country => byCode.set(country.code, country));
  });

  return { countries: Array.from(byCode.values()), isLoading: results.some(r => r.isLoading) };
}
