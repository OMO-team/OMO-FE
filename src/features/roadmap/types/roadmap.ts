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
  name: string;
  subtitle: string;
  status: 'done' | 'processing' | 'pending';
  tag?: string;
  scanStatus?: string;
  scanProgressPercent?: number;
  scanDetail?: string;
  /** done 상태일 때 업로드 완료된 파일명 목록 */
  uploadedFiles?: string[];
}

export interface UploadedFileItem {
  name: string;
  uploadedSizeMB: number;
  totalSizeMB: number;
  status: 'uploading' | 'completed' | 'error';
}

export interface CityRoadmapData {
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
