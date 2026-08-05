export interface AiReportQuestionRequest {
  question: string;
}

export type CityStatType = 'SAFETY' | 'COST' | 'HOUSING' | 'VISA' | 'INFRA' | 'INTERNET';

export interface CityStatItem {
  statType: CityStatType;
  value: number;
  maxValue: number | null;
  unit: string;
}

export interface CityCoreSummaryItem {
  category: string;
  title: string;
  content: string;
}

export interface CityProsConsResult {
  pros: string[];
  cons: string[];
  prosEmpty: boolean;
  consEmpty: boolean;
}
