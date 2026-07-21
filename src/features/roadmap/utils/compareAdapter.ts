import type { CityInsightData } from '../../../shared/types/cityInsight';
import type { CompareCity } from '../../../shared/types/compare';

/** 0~5점 스코어를 비교 모달의 0~100% 게이지 값으로 환산 */
function toPercent(score: number): number {
  return Math.round(score * 20);
}

/** 위시리스트 도시 인사이트 데이터를 비교 모달이 쓰는 CompareCity 형태로 변환 */
export function toCompareCity(city: CityInsightData): CompareCity {
  return {
    id: city.cityId,
    name: city.cityName,
    countryName: city.countryName,
    imageUrl: city.imageUrl,
    rating: city.rating,
    monthlyCost: city.monthlyCost,
    costPercent: city.costPercent,
    keyMetrics: [
      { id: 'internet', label: '인터넷', percentage: toPercent(city.infrastructureScore), barColor: 'gradient' },
      { id: 'safety', label: '치안', percentage: toPercent(city.securityScore), barColor: 'gradient' },
      { id: 'preference', label: '선호도', percentage: toPercent(city.rating), barColor: 'gradient' },
    ],
  };
}
