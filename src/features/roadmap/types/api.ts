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

export interface CityCountryInfo {
  countryId: number;
  name: string;
}

/**
 * 실제 GET /api/v1/my-home/wishlist 응답으로 확인한 구조.
 * 스웨거 문서상 스키마는 countryId/countryName을 평평하게 나열했지만,
 * 실 응답은 country 객체로 중첩되어 있고 미준비 필드는 null로 내려옴(2026-07-31 확인).
 */
export interface CityInfo {
  cityId: number;
  name: string;
  country: CityCountryInfo;
  /** 위시리스트를 도시+목적 조합으로 저장하도록 백엔드 수정 예정 — 반영 전까지는 안 내려옴 */
  purposeId?: number;
  purposeName?: string;
  imageUrl: string | null;
  rating: number | null;
  description: string | null;
  monthlyCost: number | null;
  safetyScore: number | null;
  housingScore: number | null;
  visaScore: number | null;
  languageScore: number | null;
  infraScore: number | null;
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

export interface DocumentItem {
  taskDocumentId: number;
  documentName: string;
  description: string;
  ocrSupport: boolean;
  checked: boolean;
}

export interface TaskDetailResult {
  taskId: number;
  roadmapId: number;
  name: string;
  description: string;
  category: TaskCategory;
  displayOrder: number;
  status: TaskStatus;
  isCompleted: boolean;
  dueDate: string | null;
  scheduleDDay: number | null;
  isOverdue: boolean;
  completedAt: string | null;
  completedDocumentCount: number;
  totalDocumentCount: number;
  documents: DocumentItem[];
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

/** 실 응답으로 확인됨(2026-08-03) — 로드맵 전체가 아니라 변경된 태스크 자체 필드만 내려옴 */
export interface UpdateTaskScheduleResult {
  taskId: number;
  dueDate: string;
  scheduleDDay: number;
  isOverdue: boolean;
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
