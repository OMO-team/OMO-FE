import type { KeyMetricItem } from "./cityReport";

export interface CompareCity {
  id: string;
  name: string;
  countryName: string;
  imageUrl: string;
  rating: number;
  monthlyCost: string; // "180만원"
  costPercent: number;
  keyMetrics: KeyMetricItem[]; // 순서 고정: 인터넷(gradient) → 치안(gray) → 선호도(gradient)
}
