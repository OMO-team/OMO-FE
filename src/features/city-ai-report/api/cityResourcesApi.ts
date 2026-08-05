import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { AiReportResource } from '../../../shared/types/cityReport';

export interface CityResourcesQuery {
  topic?: string;
  resourceType?: string;
}

export const cityResourcesApi = {
  /** 도시 관련자료 조회. topic/resourceType으로 필터링 가능하며 둘 다 지정 시 AND 조건 */
  get: async (cityId: number, query?: CityResourcesQuery): Promise<AiReportResource[]> => {
    const { data } = await instance.get<ApiResponse<AiReportResource[]>>(
      `/api/v1/cities/${cityId}/resources`,
      { params: query },
    );
    return data.result;
  },
};
