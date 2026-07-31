import type { CityInfo } from '../types/api';
import type { CityInsightData } from '../types/cityInsight';

const NOT_READY = '준비중';

/** 0~5점 스코어를 카드 진행바가 쓰는 0~100% 값으로 환산 */
function toPercent(score: number | null): number {
  return score != null ? Math.round(score * 20) : 0;
}

/**
 * 실 API(GET /api/v1/my-home/wishlist)의 CityInfo를 CityInsightCard가 쓰는 CityInsightData로 변환.
 * accommodationLabel/visaLabel(쉬움/보통/어려움)은 API가 점수만 줄 뿐 등급 자체를 안 내려주므로
 * 임의로 판정하지 않고 항상 "준비중"으로 표시함.
 */
export function toCityInsightData(city: CityInfo): CityInsightData {
  return {
    cityId: String(city.cityId),
    cityName: city.name,
    countryName: city.country.name,
    imageUrl: city.imageUrl ?? '',
    description: city.description ?? NOT_READY,
    rating: city.rating ?? 0,
    monthlyCost: city.monthlyCost != null ? `${city.monthlyCost}만원` : NOT_READY,
    costPercent: 0,
    accommodationPercent: toPercent(city.housingScore),
    accommodationLabel: NOT_READY,
    visaPercent: toPercent(city.visaScore),
    visaLabel: NOT_READY,
    securityScore: city.safetyScore ?? 0,
    languageScore: city.languageScore ?? 0,
    infrastructureScore: city.infraScore ?? 0,
  };
}
