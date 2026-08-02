import { useQuery } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CityQueryParams, CityItem, CitiesResponse } from '../types/cityInsight';
export function useCities(params: CityQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['cities', params],
    enabled: (options?.enabled ?? true) && (!!params.purposeType || !!params.keyword || !!params.countryCode),
    queryFn: async (): Promise<CityItem[]> => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined),
      );
      const { data } = await instance.get<ApiResponse<CitiesResponse>>('/api/v1/cities', {
        params: cleanParams,
      });
      if (!data.isSuccess) throw new Error(data.message);
      return data.result.cities;
    },
  });
}
