import type { CityItem } from '../types/cityInsight';

// GET /api/v1/cities 응답 기준: housingScore, visaScore 모두 0~5점
const MAX_SCORE = 5;

// 필터 UI 최대 옵션(300만원) 초과분을 수용하기 위한 표시용 상한값 (기획 확정 필요)
const MAX_MONTHLY_COST = 400;

function scoreToPercent(score: number): number {
  return Math.round(Math.min((score / MAX_SCORE) * 100, 100));
}

function scoreToLabel(score: number): string {
  if (score >= 3.5) return '쉬움';
  if (score >= 2) return '보통';
  return '어려움';
}

export function adaptCityToCardProps(city: CityItem) {
  return {
    costPercent: Math.round(Math.min((city.monthlyCost / MAX_MONTHLY_COST) * 100, 100)),
    accommodationPercent: scoreToPercent(city.housingScore),
    accommodationLabel: scoreToLabel(city.housingScore),
    visaPercent: scoreToPercent(city.visaScore),
    visaLabel: scoreToLabel(city.visaScore),
  };
}
