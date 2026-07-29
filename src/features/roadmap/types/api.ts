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

export type TaskCategory = 'VISA' | 'INSURANCE' | 'DOCUMENT' | 'FLIGHT' | 'ACCOMMODATION' | 'BANKING';

export type TaskStatus = 'LOCKED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface CityInfo {
  cityId: number;
  name: string;
  countryId: number;
  countryName: string;
  imageUrl: string;
  rating: number;
  description: string;
  monthlyCost: number;
  safetyScore: number;
  housingScore: number;
  visaScore: number;
  languageScore: number;
  infraScore: number;
}

export interface CityListResult {
  totalCount: number;
  cities: CityInfo[];
}

export interface RoadmapListItem {
  roadmapId: number;
  title: string;
  cityId: number;
  cityName: string;
  cityImageUrl: string;
  purposeId: number;
  purposeName: string;
  departureDate: string | null;
  stayMonths: number | null;
  departureDDay: number | null;
  completedTaskCount: number;
  totalTaskCount: number;
  progressRate: number;
  nextTaskId: number | null;
  nextTaskName: string | null;
  nextScheduleDate: string | null;
  nextScheduleDDay: number | null;
  isNextScheduleOverdue: boolean;
}

export interface RoadmapBudget {
  initialSettlementCost: number;
  monthlyCost: number;
  totalCost: number;
}

export interface RoadmapTaskItem {
  taskId: number;
  name: string;
  category: TaskCategory;
  dueDate: string | null;
  scheduleDDay: number | null;
  isOverdue: boolean;
  status: TaskStatus;
  isCompleted: boolean;
}

/** 로드맵 목록 항목 + 예산/태스크 목록 (로드맵 상세 조회 응답) */
export interface RoadmapDetail extends RoadmapListItem {
  budget: RoadmapBudget | null;
  tasks: RoadmapTaskItem[];
}

export interface CreateRoadmapRequest {
  cityId: number;
  purposeId: number;
}

export interface CreateRoadmapResult {
  roadmapId: number;
  title: string;
  cityId: number;
  purposeId: number;
  /** 최초 생성 시점에는 미설정(null) — 이후 updateSchedule로 설정 */
  departureDate: string | null;
  taskCount: number;
}

export interface UpdateRoadmapBudgetRequest {
  stayMonths: number;
}

export interface UpdateRoadmapBudgetResult {
  roadmapId: number;
  stayMonths: number;
  initialSettlementCost: number;
  monthlyCost: number;
  totalCost: number;
}

export interface UpdateRoadmapScheduleRequest {
  departureDate: string;
}

export interface TaskSchedule {
  taskId: number;
  dueDate: string;
}

export interface UpdateRoadmapScheduleResult {
  roadmapId: number;
  departureDate: string;
  departureDDay: number;
  taskSchedules: TaskSchedule[];
}

export interface UpdateTaskScheduleRequest {
  dueDate: string;
}

export interface CompleteTaskResult {
  taskId: number;
  isCompleted: boolean;
  completedAt: string;
  status: TaskStatus;
}

export interface UpdateTaskDocumentCheckRequest {
  checked: boolean;
}

export interface UpdateTaskDocumentCheckResult {
  taskDocumentId: number;
  checked: boolean;
  completedCount: number;
  totalCount: number;
}
