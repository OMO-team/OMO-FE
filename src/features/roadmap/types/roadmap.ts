import type { TimeLineTaskCardStatus } from '../components/TimeLineTaskCard';

export interface RoadmapTaskData {
  status: TimeLineTaskCardStatus;
  dDay?: string;
  date: string;
  category: string;
  title: string;
  stepsCompleted?: number;
  stepsTotal?: number;
  /** true면 D-day 태그 옆에 "서류" 유형 라벨 표시 (서류가 딸린 태스크) */
  hasDocuments?: boolean;
  prerequisiteWarning?: string;
}

export interface BudgetPlanData {
  months: number;
  initialSettlementCost: number;
  monthlyLivingCost: number;
  stayMonths: number;
  livingCostSubtotal: number;
  totalBudget: number;
}

export interface AiReportData {
  score: number;
  cityName: string;
  summary: string;
}

export interface RequiredDocumentData {
  /** 서류 완료 체크 API(PATCH /api/v1/task-documents/{taskDocumentId}/check) 식별자 */
  taskDocumentId: number;
  documentTemplateId?: number;
  name: string;
  subtitle?: string;
  isChecked: boolean;
  displayOrder?: number;
  /** isChecked일 때 업로드 완료된 파일명 목록 */
  uploadedFiles?: string[];
}

export interface UploadedFileItem {
  name: string;
  uploadedSizeMB: number;
  totalSizeMB: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

export interface CityRoadmapData {
  /** 위시리스트 등 다른 도메인과 도시를 매칭할 때 쓰는 공용 식별자 */
  cityId: string;
  /** 로드맵 상세 조회/삭제 등 실 API 호출에 필요한 식별자 — mock 데이터에는 없을 수 있음 */
  roadmapId?: number;
  cityName: string;
  countryName: string;
  /** 같은 도시라도 목적별로 로드맵이 따로 존재하고 목적마다 필요 서류가 달라서, 카드에서 함께 표시 */
  purposeId?: number;
  purposeName?: string;
  progressPercent: number;
  description: string;
  rating: number;
  isWishlisted?: boolean;
  costProgressPercent: number;
  completedSteps: number;
  totalSteps: number;
  nextSchedule: string;
  imageUrl: string;
}

export interface CountryGroupData {
  countryName: string;
  cityCount: number;
  cities: CityRoadmapData[];
}
