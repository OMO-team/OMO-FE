import { instance } from '../../../lib/axios';
import type { ApiResponse } from '../../../shared/types/api';
import type {
  BriefingInitResult,
  BriefingRequest,
  BriefingStatusResult,
  ChipInfo,
} from '../types/dto';

export const chatApi = {
  getRecommendChips: async () => {
    const { data } = await instance.get<ApiResponse<{ prompts: ChipInfo[] }>>(
      '/api/v1/ai-search/recommend-chips'
    );
    return data.result.prompts;
  },

  startBriefing: async (body: BriefingRequest) => {
    const { data } = await instance.post<ApiResponse<BriefingInitResult>>(
      '/api/v1/ai-search/briefing',
      body
    );
    return data.result;
  },

  getBriefingStatus: async (taskId: string) => {
    const { data } = await instance.get<ApiResponse<BriefingStatusResult>>(
      `/api/v1/ai-search/briefing/status/${taskId}`
    );
    return data.result;
  },

  deleteSession: (sessionId: number) =>
    instance.delete<ApiResponse<string>>(`/api/v1/ai-search/sessions/${sessionId}`),
};
