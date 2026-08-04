import { useQuery } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CityQueryParams, CityItem, CitiesResponse } from '../types/cityInsight';
export function useCities(params: CityQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['cities', params],
    staleTime: 1000 * 60 * 5,
    enabled: (options?.enabled ?? true) && (!!params.purposeType || !!params.keyword || !!params.countryCodes?.length),
    queryFn: async (): Promise<CityItem[]> => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)),
      );
      const { data } = await instance.get<ApiResponse<CitiesResponse>>('/api/v1/cities', {
        params: cleanParams,
        paramsSerializer: { indexes: null },
      });
      if (!data.isSuccess) throw new Error(data.message);
      return data.result.cities;
    },
  });
}
