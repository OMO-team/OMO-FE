import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CompareResult } from '../types/dto';

export const compareApi = {
  /** 2~3개 도시의 수치 스탯을 비교 조회 */
  get: async (cityIds: number[]): Promise<CompareResult> => {
    const { data } = await instance.get<ApiResponse<CompareResult>>('/api/v1/cities/compare', {
      params: { cityIds: cityIds.join(',') },
    });
    return data.result;
  },
};
