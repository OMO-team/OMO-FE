import { instance } from '../../../lib/axios';
import { unwrap } from './apiUtils';
import type { ApiResponse, WishlistCityListResult } from '../types/api';

export const wishlistApi = {
  /** 최근 추가 순으로 정렬된 내 위시리스트 */
  list: async (): Promise<WishlistCityListResult> => {
    const { data } = await instance.get<ApiResponse<WishlistCityListResult>>('/api/v1/my-home/wishlist');
    return unwrap(data);
  },

  /**
   * 목적과 함께 담김. 이미 담긴 도시를 다른 목적으로 다시 추가해도 성공은 하지만
   * 항목이 늘지 않고 처음 담을 때의 목적이 유지됨(도시당 1개).
   */
  add: async (cityId: number, purposeId: number): Promise<void> => {
    const { data } = await instance.post<ApiResponse<null>>(`/api/v1/wishlist/${cityId}`, null, {
      params: { purposeId },
    });
    unwrap(data);
  },

  /** 도시+목적 조합으로 저장되므로 삭제도 목적을 지정해야 함 (같은 도시의 다른 목적은 그대로 남음) */
  remove: async (cityId: number, purposeId: number): Promise<void> => {
    const { data } = await instance.delete<ApiResponse<null>>(`/api/v1/wishlist/${cityId}`, {
      params: { purposeId },
    });
    unwrap(data);
  },
};
