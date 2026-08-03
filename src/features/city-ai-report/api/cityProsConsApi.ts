import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CityProsConsResult } from '../types/dto';

export const cityProsConsApi = {
  /** 도시의 장단점 조회. pros/cons 각각 display_order 오름차순 정렬됨 */
  get: async (cityId: number): Promise<CityProsConsResult> => {
    const { data } = await instance.get<ApiResponse<CityProsConsResult>>(
      `/api/v1/cities/${cityId}/pros-cons`,
    );
    return data.result;
  },
};
