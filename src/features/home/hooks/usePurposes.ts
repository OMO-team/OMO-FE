import { useQuery } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { Purpose } from '../types/home';

export type { Purpose };

export function usePurposes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['purposes'],
    queryFn: async (): Promise<Purpose[]> => {
      const { data } = await instance.get<ApiResponse<Purpose[]>>('/api/v1/purposes');
      if (!data.isSuccess) throw new Error(data.message);
      return data.result;
    },
    staleTime: Infinity,
    enabled: options?.enabled ?? true,
  });
}
