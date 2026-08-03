export interface AiReportQuestionRequest {
  question: string;
}

export type CityStatType = 'SAFETY' | 'COST' | 'HOUSING' | 'VISA' | 'INFRA';

export interface CityStatItem {
  statType: CityStatType;
  value: number;
  maxValue: number | null;
  unit: string;
}
