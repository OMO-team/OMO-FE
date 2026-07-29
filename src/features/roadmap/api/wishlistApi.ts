import { instance } from '../../../lib/axios';
import { unwrap } from './apiUtils';
import type { ApiResponse, CityListResult } from '../types/api';

export const wishlistApi = {
  /** 최근 추가 순으로 정렬된 내 위시리스트 */
  list: async (): Promise<CityListResult> => {
    const { data } = await instance.get<ApiResponse<CityListResult>>('/api/v1/my-home/wishlist');
    return unwrap(data);
  },

  /** 이미 추가된 도시를 다시 추가해도 성공 처리됨 */
  add: async (cityId: number): Promise<void> => {
    const { data } = await instance.post<ApiResponse<null>>(`/api/v1/wishlist/${cityId}`);
    unwrap(data);
  },

  /** 위시리스트에 없는 도시를 삭제해도 성공 처리됨 */
  remove: async (cityId: number): Promise<void> => {
    const { data } = await instance.delete<ApiResponse<null>>(`/api/v1/wishlist/${cityId}`);
    unwrap(data);
  },
};
