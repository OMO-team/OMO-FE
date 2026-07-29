import { instance } from '../../../lib/axios';
import { unwrap } from './apiUtils';
import type { ApiResponse, UpdateTaskDocumentCheckRequest, UpdateTaskDocumentCheckResult } from '../types/api';

export const taskDocumentsApi = {
  /** 서류 체크 상태 변경 — 모든 서류가 체크되면 백엔드가 태스크를 자동으로 완료 처리함 */
  updateCheck: async (
    taskDocumentId: number,
    payload: UpdateTaskDocumentCheckRequest,
  ): Promise<UpdateTaskDocumentCheckResult> => {
    const { data } = await instance.patch<ApiResponse<UpdateTaskDocumentCheckResult>>(
      `/api/v1/task-documents/${taskDocumentId}/check`,
      payload,
    );
    return unwrap(data);
  },
};
