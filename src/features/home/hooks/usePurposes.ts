import { useQuery } from '@tanstack/react-query';
import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';

export interface Purpose {
  purposeId: number;
  type: 'WORKING_HOLIDAY' | 'EXCHANGE_STUDENT' | 'INTERNSHIP';
  name: string;
}

export function usePurposes() {
  return useQuery({
    queryKey: ['purposes'],
    queryFn: async (): Promise<Purpose[]> => {
      const { data } = await instance.get<ApiResponse<Purpose[]>>('/api/v1/purposes');
      if (!data.isSuccess) throw new Error(data.message);
      return data.result;
    },
    staleTime: Infinity,
  });
}
