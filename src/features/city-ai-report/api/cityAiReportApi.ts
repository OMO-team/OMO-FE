import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type { AISearchResultData } from '../../../shared/types/cityReport';
import type { AiReportQuestionRequest } from '../types/dto';

export const cityAiReportApi = {
  /** 도시에 대한 질문을 Gemini로 분석해 AI 답변과 관련자료를 조회 */
  askQuestion: async (
    cityId: number,
    body: AiReportQuestionRequest
  ): Promise<AISearchResultData> => {
    const { data } = await instance.post<ApiResponse<AISearchResultData>>(
      `/api/v1/cities/${cityId}/ai-report`,
      body
    );
    return data.result;
  },
};
