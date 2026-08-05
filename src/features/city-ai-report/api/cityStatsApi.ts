import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CityStatItem } from '../types/dto';

export const cityStatsApi = {
  /** 도시의 생활비/치안/주거/비자/인프라 스탯 조회 */
  get: async (cityId: number): Promise<CityStatItem[]> => {
    const { data } = await instance.get<ApiResponse<CityStatItem[]>>(`/api/v1/cities/${cityId}/stats`);
    return data.result;
  },
};
