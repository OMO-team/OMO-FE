import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CompareItem } from '../types/dto';

export const compareItemsApi = {
  /** 로그인한 회원의 비교함 목록 조회 */
  list: async (): Promise<CompareItem[]> => {
    const { data } = await instance.get<ApiResponse<CompareItem[]>>('/api/v1/members/me/compare-items');
    return data.result;
  },

  /** 비교함에 도시 담기(최대 3개). 이미 담겨있거나(COMPARE409_1) 3개 초과(COMPARE400_1)면 에러 */
  add: async (cityId: number): Promise<void> => {
    await instance.post<ApiResponse<null>>('/api/v1/members/me/compare-items', { cityId });
  },

  /** 비교함에서 도시 삭제 */
  remove: async (cityId: number): Promise<void> => {
    await instance.delete<ApiResponse<string>>(`/api/v1/members/me/compare-items/${cityId}`);
  },
};
