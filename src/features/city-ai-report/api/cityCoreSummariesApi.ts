import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CityCoreSummaryItem } from '../types/dto';

export const cityCoreSummariesApi = {
  /** 도시 상세 리포트 최상단 핵심정보 6대요약 조회. 데이터 없는 카테고리는 배열에서 아예 빠짐 */
  get: async (cityId: number): Promise<CityCoreSummaryItem[]> => {
    const { data } = await instance.get<ApiResponse<CityCoreSummaryItem[]>>(
      `/api/v1/cities/${cityId}/core-summaries`,
    );
    return data.result;
  },
};
