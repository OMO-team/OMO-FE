import axios from 'axios';
import { instance } from '../../../lib/axios';
import type {
  ApiResponse,
  TaskDetail,
  TaskListItem,
  TaskStatus,
  CreateTaskRequest,
  CreateTaskResult,
  UpdateTaskRequest,
  UpdateTaskResult,
} from '../types/api';

function unwrap<T>(data: ApiResponse<T>): T {
  if (!data.isSuccess) throw new Error(data.message);
  return data.result;
}

function isNotFound(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export const tasksApi = {
  get: async (taskId: number): Promise<TaskDetail | null> => {
    try {
      const { data } = await instance.get<ApiResponse<TaskDetail>>(`/api/v1/tasks/${taskId}`);
      return unwrap(data);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  },

  listByRoadmap: async (roadmapId: number, status?: TaskStatus): Promise<TaskListItem[]> => {
    try {
      const { data } = await instance.get<ApiResponse<TaskListItem[]>>(`/api/v1/roadmaps/${roadmapId}/tasks`, {
        params: status === undefined ? undefined : { status },
      });
      return unwrap(data);
    } catch (error) {
      if (isNotFound(error)) return [];
      throw error;
    }
  },

  create: async (roadmapId: number, payload: CreateTaskRequest): Promise<CreateTaskResult> => {
    const { data } = await instance.post<ApiResponse<CreateTaskResult>>(`/api/v1/roadmaps/${roadmapId}/tasks`, payload);
    return unwrap(data);
  },

  update: async (taskId: number, payload: UpdateTaskRequest): Promise<UpdateTaskResult | null> => {
    try {
      const { data } = await instance.patch<ApiResponse<UpdateTaskResult>>(`/api/v1/tasks/${taskId}`, payload);
      return unwrap(data);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  },

  remove: async (taskId: number): Promise<boolean> => {
    try {
      const { data } = await instance.delete<ApiResponse<null>>(`/api/v1/tasks/${taskId}`);
      unwrap(data);
      return true;
    } catch (error) {
      if (isNotFound(error)) return false;
      throw error;
    }
  },
};
