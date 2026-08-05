import { instance } from '../../../lib/axios';
import { unwrap } from './apiUtils';
import type {
  ApiResponse,
  CompleteTaskResult,
  TaskDetailResult,
  UpdateTaskScheduleRequest,
  UpdateTaskScheduleResult,
} from '../types/api';

export const tasksApi = {
  /** 태스크 이름/카테고리/일정/상태와 필요한 서류 목록(documents)까지 포함된 상세 */
  get: async (taskId: number): Promise<TaskDetailResult> => {
    const { data } = await instance.get<ApiResponse<TaskDetailResult>>(`/api/v1/tasks/${taskId}`);
    return unwrap(data);
  },

  /** 서류가 필요 없는 태스크를 수동으로 완료 처리 */
  complete: async (taskId: number): Promise<CompleteTaskResult> => {
    const { data } = await instance.patch<ApiResponse<CompleteTaskResult>>(`/api/v1/tasks/${taskId}/complete`);
    return unwrap(data);
  },

  updateSchedule: async (
    taskId: number,
    payload: UpdateTaskScheduleRequest,
  ): Promise<UpdateTaskScheduleResult> => {
    const { data } = await instance.patch<ApiResponse<UpdateTaskScheduleResult>>(
      `/api/v1/tasks/${taskId}/schedule`,
      payload,
    );
    return unwrap(data);
  },
};
