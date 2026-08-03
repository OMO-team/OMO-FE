import { CITY_INFO_KO } from '../mocks/cityCountryMap';
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
  // 위시리스트 API도 도시명/국가명이 영문으로 내려와서, 시드 데이터 기반 한글 매핑으로 대신 채움
  const cityInfo = CITY_INFO_KO[city.cityId];
  return {
    cityId: String(city.cityId),
    cityName: cityInfo?.cityName ?? city.name,
    countryName: cityInfo?.countryName ?? city.country.name,
    // purposeName은 위시리스트가 도시 단위로만 저장돼서 아직 못 채움 — 도시+목적 조합으로 바뀌면 여기서 전달

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
