import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { CompareItem } from '../types/dto';

export const compareItemsApi = {
  /** 로그인한 회원의 비교함 목록 조회 */
  list: async (): Promise<CompareItem[]> => {
    const { data } = await instance.get<ApiResponse<CompareItem[]>>('/api/v1/members/me/compare-items');
    return data.result;
  },
};
