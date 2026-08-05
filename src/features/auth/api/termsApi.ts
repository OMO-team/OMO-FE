import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { TermsResult } from '../types/dto';

export const termsApi = {
  /** 회원가입 화면에서 표시할 약관 목록 조회. content는 Markdown 형식 */
  get: async (): Promise<TermsResult> => {
    const { data } = await instance.get<ApiResponse<TermsResult>>('/api/v1/terms');
    return data.result;
  },
};
