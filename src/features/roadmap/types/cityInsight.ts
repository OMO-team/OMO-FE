export interface CityInsightData {
  cityId: string;
  cityName: string;
  countryName: string;
  /** 위시리스트 API가 아직 목적을 안 내려줘서 항상 undefined — 응답에 추가되면 wishlistAdapter에서 채움 */
  purposeName?: string;
  imageUrl: string;
  description: string;
  rating: number;
  monthlyCost: string;
  costPercent: number;
  accommodationPercent: number;
  accommodationLabel: string;
  visaPercent: number;
  visaLabel: string;
  securityScore: number;
  languageScore: number;
  infrastructureScore: number;
}
