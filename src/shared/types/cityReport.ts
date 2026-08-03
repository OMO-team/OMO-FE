export interface KeySummaryItem {
  id: string;
  title: string;
  description: string;
}

export interface KeyMetricItem {
  id: string;
  label: string;
  /** null이면 기준치(maxValue)가 없는 지표라 막대 없이 displayValue만 표시 */
  percentage: number | null;
  barColor: "gray" | "gradient";
  displayValue: string;
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
  pros: string[];
  cons: string[];
  vlogs: VlogItem[];
  reviews: ReviewItem[];
}
