import { useQuery } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { Country, CountriesResponse, Purpose } from '../../home/types/home';

const PURPOSE_TYPES: Purpose['type'][] = ['WORKING_HOLIDAY', 'EXCHANGE_STUDENT', 'INTERNSHIP'];

async function fetchCountriesByPurpose(purposeType: Purpose['type']): Promise<Country[]> {
  const { data } = await instance.get<ApiResponse<CountriesResponse>>('/api/v1/countries', {
    params: { purposeType },
  });
  if (!data.isSuccess) throw new Error(data.message);
  return data.result.countries;
}

/** AI 문장에서 언급된 국가명을 매칭하려면 목적(purpose)에 상관없이 전체 국가 목록이 필요한데,
 *  /api/v1/countries는 purposeType 없이는 400을 반환해 세 목적의 결과를 합쳐 중복 제거한다 */
export function useAllCountries(enabled: boolean) {
  return useQuery({
    queryKey: ['countries', 'all'],
    queryFn: async () => {
      const lists = await Promise.all(PURPOSE_TYPES.map(fetchCountriesByPurpose));
      const merged = new Map<string, Country>();
      for (const list of lists) {
        for (const country of list) merged.set(country.code, country);
      }
      return Array.from(merged.values());
    },
    enabled,
    staleTime: Infinity,
  });
}
