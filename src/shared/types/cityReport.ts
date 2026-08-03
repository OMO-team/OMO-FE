export interface KeySummaryItem {
  id: string;
  title: string;
  description: string;
}

export interface KeyMetricItem {
  id: string;
  label: string;
  percentage: number;
  barColor: "gray" | "gradient";
}

export interface VlogItem {
  id: string;
  tag: string;
  title: string;
  thumbnailUrl?: string;
}

export interface ReviewItem {
  id: string;
  authorInitial: string;
  authorName: string;
  rating: number;
  content: string;
}

export interface AiReportResource {
  topic: string;
  resourceType: string;
  title: string;
  source: string;
  url: string;
}

export interface AISearchResultData {
  summary: string;
  resources: AiReportResource[];
}

export interface CityReportData {
  /** AI 맞춤 검색(POST /api/v1/cities/{cityId}/ai-report) 호출에 쓰는 식별자 */
  cityId: number;
  cityName: string;
  heroImageUrl: string;
  ratingBadge: number;
  totalScore: number;
  oneLineSummary: string;
  searchKeywords: string[];
  keySummary: KeySummaryItem[];
  keyMetrics: KeyMetricItem[];
  pros: string[];
  cons: string[];
  vlogs: VlogItem[];
  reviews: ReviewItem[];
}
