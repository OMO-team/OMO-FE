import { instance } from '../../../lib/axios';
import { unwrap, isNotFound } from './apiUtils';
import type {
  ApiResponse,
  CreateRoadmapRequest,
  CreateRoadmapResult,
  RoadmapDetail,
  RoadmapListItem,
  UpdateRoadmapBudgetRequest,
  UpdateRoadmapBudgetResult,
  UpdateRoadmapScheduleRequest,
  UpdateRoadmapScheduleResult,
} from '../types/api';

export const roadmapsApi = {
  create: async (payload: CreateRoadmapRequest): Promise<CreateRoadmapResult> => {
    const { data } = await instance.post<ApiResponse<CreateRoadmapResult>>('/api/v1/roadmaps', payload);
    return unwrap(data);
  },

  /** 내 로드맵 목록 (도시명/이미지/진행률 포함 — 별도 도시 조회 없이 바로 렌더링 가능) */
  list: async (): Promise<RoadmapListItem[]> => {
    const { data } = await instance.get<ApiResponse<RoadmapListItem[]>>('/api/v1/my-home/roadmaps');
    return unwrap(data);
  },

  /** 예산/태스크 목록까지 포함된 로드맵 상세 */
  get: async (roadmapId: number): Promise<RoadmapDetail | null> => {
    try {
      const { data } = await instance.get<ApiResponse<RoadmapDetail>>(`/api/v1/roadmaps/${roadmapId}`);
      return unwrap(data);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  },

  remove: async (roadmapId: number): Promise<boolean> => {
    try {
      const { data } = await instance.delete<ApiResponse<null>>(`/api/v1/roadmaps/${roadmapId}`);
      unwrap(data);
      return true;
    } catch (error) {
      if (isNotFound(error)) return false;
      throw error;
    }
  },

  updateBudget: async (roadmapId: number, payload: UpdateRoadmapBudgetRequest): Promise<UpdateRoadmapBudgetResult> => {
    const { data } = await instance.patch<ApiResponse<UpdateRoadmapBudgetResult>>(
      `/api/v1/roadmaps/${roadmapId}/budget`,
      payload,
    );
    return unwrap(data);
  },

  updateSchedule: async (
    roadmapId: number,
    payload: UpdateRoadmapScheduleRequest,
  ): Promise<UpdateRoadmapScheduleResult> => {
    const { data } = await instance.patch<ApiResponse<UpdateRoadmapScheduleResult>>(
      `/api/v1/roadmaps/${roadmapId}/schedule`,
      payload,
    );
    return unwrap(data);
  },
};
