export interface ApiSuccessResponse<T> {
  isSuccess: true;
  code: string;
  message: string;
  result: T;
}

export interface ApiErrorResponse {
  isSuccess: false;
  code: string;
  message: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface CreateRoadmapRequest {
  cityId: number;
  purposeId: number;
  departureDate: string;
  stayMonths: number;
}

export interface CreateRoadmapResult {
  roadmapId: number;
  cityId: number;
  purposeId: number;
  departureDate: string;
  dDay: number;
  stayMonths: number;
  isActive: boolean;
  createdAt: string;
}

export interface RoadmapResult extends CreateRoadmapResult {
  updatedAt: string;
}

export interface RoadmapListItem {
  roadmapId: number;
  cityId: number;
  departureDate: string;
  dDay: number;
  stayMonths: number;
  isActive: boolean;
}

export type UpdateRoadmapRequest = Partial<Pick<CreateRoadmapRequest, 'departureDate' | 'stayMonths'>>;

export interface UpdateRoadmapResult {
  roadmapId: number;
  departureDate: string;
  dDay: number;
  stayMonths: number;
  updatedAt: string;
}

export type TaskStatus = 'locked' | 'pending' | 'inProgress' | 'completed';

export interface TaskDetail {
  taskId: number;
  roadmapId: number;
  taskName: string;
  dueDate: string;
  priority: number;
  isCompleted: boolean;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListItem {
  taskId: number;
  roadmapId: number;
  taskName: string;
  dueDate: string;
  priority: number;
  isCompleted: boolean;
  status: TaskStatus;
}

export interface CreateTaskRequest {
  taskName: string;
  dueDate: string;
  priority: number;
}

export interface CreateTaskResult {
  taskId: number;
  roadmapId: number;
  taskName: string;
  dueDate: string;
  priority: number;
  isCompleted: boolean;
  status: TaskStatus;
  createdAt: string;
}

export type UpdateTaskRequest = Partial<
  Pick<CreateTaskRequest, 'taskName' | 'dueDate' | 'priority'> & { isCompleted: boolean }
>;

export interface UpdateTaskResult {
  taskId: number;
  isCompleted: boolean;
  status: TaskStatus;
  /** 이 작업 완료로 잠금 해제된(lock -> upcoming) 후속 태스크 ID 목록 */
  unlockedTaskIds: number[];
  updatedAt: string;
}
