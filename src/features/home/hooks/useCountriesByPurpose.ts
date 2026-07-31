import { useQuery } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { Purpose, Country, CountriesResponse } from '../types/home';

export type { Country };

export function useCountriesByPurpose(purposeType: Purpose['type'] | undefined) {
  return useQuery({
    queryKey: ['countries', purposeType],
    queryFn: async (): Promise<Country[]> => {
      const { data } = await instance.get<ApiResponse<CountriesResponse>>('/api/v1/countries', {
        params: { purposeType },
      });
      if (!data.isSuccess) throw new Error(data.message);
      return data.result.countries;
    },
    enabled: !!purposeType,
  });
}
