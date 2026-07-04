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

export interface RelatedDocument {
  id: string;
  category: string;
  title: string;
}

export interface AISearchResultData {
  answer: string;
  documents: RelatedDocument[];
}

export interface CityReportData {
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
