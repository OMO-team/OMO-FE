import { CITY_INFO_KO } from '../mocks/cityCountryMap';
import type { CityInfo } from '../types/api';
import type { CityInsightData } from '../types/cityInsight';

const NOT_READY = '준비중';

/**
 * 생활비 게이지와 난이도 라벨은 API가 점수/금액만 주고 비율·등급은 안 내려줘서 프론트에서 환산한다.
 * 도시 탐색 페이지(city-insight/utils/cityAdapter.ts)와 같은 기준을 써야 같은 도시가 두 화면에서
 * 같게 보이므로 값을 맞춰둠 — #84 머지 후 공용 유틸로 합칠 것.
 */
const MAX_MONTHLY_COST = 400;
const EASY_SCORE = 3.5;
const NORMAL_SCORE = 2;

/** 0~5점 스코어를 카드 진행바가 쓰는 0~100% 값으로 환산 */
function toPercent(score: number | null): number {
  return score != null ? Math.round(score * 20) : 0;
}

function toCostPercent(monthlyCost: number | null): number {
  if (monthlyCost == null) return 0;
  return Math.round(Math.min((monthlyCost / MAX_MONTHLY_COST) * 100, 100));
}

function toDifficultyLabel(score: number | null): string {
  if (score == null) return NOT_READY;
  if (score >= EASY_SCORE) return '쉬움';
  if (score >= NORMAL_SCORE) return '보통';
  return '어려움';
}

/** 목적은 위시리스트 항목에만 붙어 있고, 도시 카탈로그(GET /api/v1/cities)에는 없음 */
type CityInsightSource = CityInfo & { purposeId?: number; purposeName?: string };

/** 도시 정보를 CityInsightCard / AI 리포트가 쓰는 CityInsightData로 변환 */
export function toCityInsightData(city: CityInsightSource): CityInsightData {
  // 도시명/국가명이 영문으로 내려와서, 시드 데이터 기반 한글 매핑으로 대신 채움
  const cityInfo = CITY_INFO_KO[city.cityId];
  return {
    cityId: String(city.cityId),
    cityName: cityInfo?.cityName ?? city.name,
    countryName: cityInfo?.countryName ?? city.country.name,
    purposeId: city.purposeId,
    purposeName: city.purposeName,
    imageUrl: city.imageUrl ?? '',
    description: city.description ?? NOT_READY,
    rating: city.rating ?? 0,
    monthlyCost: city.monthlyCost != null ? `${city.monthlyCost}만원` : NOT_READY,
    costPercent: toCostPercent(city.monthlyCost),
    accommodationPercent: toPercent(city.housingScore),
    accommodationLabel: toDifficultyLabel(city.housingScore),
    visaPercent: toPercent(city.visaScore),
    visaLabel: toDifficultyLabel(city.visaScore),
    securityScore: city.safetyScore ?? 0,
    languageScore: city.languageScore ?? 0,
    infrastructureScore: city.internetScore ?? 0,
  };
}
