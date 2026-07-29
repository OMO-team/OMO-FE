import { instance } from '../../../lib/axios';
import { unwrap } from './apiUtils';
import type {
  ApiResponse,
  CompleteTaskResult,
  RoadmapTaskItem,
  UpdateRoadmapScheduleResult,
  UpdateTaskScheduleRequest,
} from '../types/api';

export const tasksApi = {
  /**
   * 스웨거 스펙 상 응답 스키마가 로드맵 상세 조회와 같은 이름(DetailResultDTO)으로 잡혀있어
   * 문서 생성 시 이름이 충돌했을 가능성이 있음 — 실제 응답은 RoadmapTaskItem에 가까울 것으로
   * 추정하고 우선 이렇게 타입을 잡음. 실 연동 테스트 시 응답 확인 후 수정 필요.
   */
  get: async (taskId: number): Promise<RoadmapTaskItem> => {
    const { data } = await instance.get<ApiResponse<RoadmapTaskItem>>(`/api/v1/tasks/${taskId}`);
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
  ): Promise<UpdateRoadmapScheduleResult> => {
    const { data } = await instance.patch<ApiResponse<UpdateRoadmapScheduleResult>>(
      `/api/v1/tasks/${taskId}/schedule`,
      payload,
    );
    return unwrap(data);
  },
};
