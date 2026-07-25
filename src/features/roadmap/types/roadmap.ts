import type { TimeLineTaskCardStatus } from '../components/TimeLineTaskCard';

export interface RoadmapTaskData {
  status: TimeLineTaskCardStatus;
  dDay?: string;
  date: string;
  category: string;
  title: string;
  stepsCompleted?: number;
  stepsTotal?: number;
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
  /** true면 "촬영하여 자동 체크" 버튼(카메라 아이콘) 노출 */
  ocrSupport: boolean;
  displayOrder?: number;
  /** 파일 업로드 후 서버 파싱을 기다리는 중일 때 표시 (isChecked가 false일 때만 의미 있음) */
  isProcessing?: boolean;
  scanStatus?: string;
  scanProgressPercent?: number;
  scanDetail?: string;
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
  cityName: string;
  countryName: string;
  progressPercent: number;
  description: string;
  rating: number;
  isWished?: boolean;
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
