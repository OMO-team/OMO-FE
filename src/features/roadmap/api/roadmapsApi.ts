import axios from 'axios';
import { instance } from '../../../lib/axios';
import type {
  ApiResponse,
  CreateRoadmapRequest,
  CreateRoadmapResult,
  RoadmapResult,
  RoadmapListItem,
  UpdateRoadmapRequest,
  UpdateRoadmapResult,
} from '../types/api';

function unwrap<T>(data: ApiResponse<T>): T {
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
}

function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export const roadmapsApi = {
  create: async (payload: CreateRoadmapRequest): Promise<CreateRoadmapResult> => {
    const { data } = await instance.post<ApiResponse<CreateRoadmapResult>>('/api/v1/roadmaps', payload);
    return unwrap(data);
  },

  get: async (roadmapId: number): Promise<RoadmapResult | null> => {
    try {
      const { data } = await instance.get<ApiResponse<RoadmapResult>>(`/api/v1/roadmaps/${roadmapId}`);
      return unwrap(data);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  },

  list: async (isActive?: boolean): Promise<RoadmapListItem[]> => {
    const { data } = await instance.get<ApiResponse<RoadmapListItem[]>>('/api/v1/roadmaps', {
      params: isActive === undefined ? undefined : { isActive },
    });
    return unwrap(data);
  },

  update: async (roadmapId: number, payload: UpdateRoadmapRequest): Promise<UpdateRoadmapResult | null> => {
    try {
      const { data } = await instance.patch<ApiResponse<UpdateRoadmapResult>>(`/api/v1/roadmaps/${roadmapId}`, payload);
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
};
