import type { CityItem } from '../types/cityInsight';

const MAX_MONTHLY_COST = 400;

function scoreToPercent(score: number): number {
  return Math.round(Math.min((score / 10) * 100, 100));
}

function scoreToLabel(score: number): string {
  if (score >= 7) return '쉬움';
  if (score >= 4) return '보통';
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
