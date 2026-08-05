import { instance } from '../../../lib/axios';
import { unwrap } from './apiUtils';
import type { ApiResponse, CityListResult } from '../types/api';

export const citiesApi = {
  /**
   * 도시 카탈로그 전체(266개). 단일 도시 조회 엔드포인트가 없어서 목록에서 찾아 씀 —
   * 도시 정보는 거의 바뀌지 않으니 쿼리 캐시를 길게 잡고 화면 간에 공유한다.
   */
  list: async (): Promise<CityListResult> => {
    const { data } = await instance.get<ApiResponse<CityListResult>>('/api/v1/cities');
    return unwrap(data);
  },
};
