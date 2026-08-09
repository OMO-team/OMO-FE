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
  imageUrl: string | null;
  rating: number | null;
  description: string | null;
  monthlyCost: number | null;
  safetyScore: number | null;
  housingScore: number | null;
  visaScore: number | null;
  languageScore: number | null;
  /** 카드에는 "인프라"로 표시되는 값 — 응답 필드명은 internetScore */
  internetScore: number | null;
}

/** 위시리스트 항목 = 도시 정보 + 담을 때 함께 저장한 목적 */
export interface WishlistCityInfo extends CityInfo {
  purposeId: number;
  purposeName: string;
}

export interface WishlistCityListResult {
  totalCount: number;
  cities: WishlistCityInfo[];
}

/** 도시 목록은 페이지네이션 응답 — 한 번에 최대 100개까지만 내려온다 */
export interface CityPageResult {
  data: CityInfo[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface RoadmapListItem {
  roadmapId: number;
  title: string;
  cityId: number;
  cityName: string;
  cityImageUrl: string;
  country: CityCountryInfo;
  purposeId: number;
  purposeName: string;
  /** 준비 시작일 — 로드맵을 만든 시점으로 서버가 정하며, 사용자가 고르지 않는다 */
  startDate: string | null;
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
  /** 이 태스크에 딸린 서류 수 — 0이면 서류 없이 완료하는 행동형 태스크 */
  totalDocumentCount: number;
  /**
   * 체크가 끝난 서류 수. 목록 응답에는 아직 없어서 optional —
   * 백엔드에 추가되면 타임라인 카드의 "3/4 완료" 표기가 자동으로 켜진다.
   */
  completedDocumentCount?: number;
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
