import { berlinReportData } from '../../city-ai-report/mocks/mockData';
import type { CityReportData } from '../../../shared/types/cityReport';
import type { CityInsightData } from '../types/cityInsight';

/**
 * 도시별 AI 리포트 상세 콘텐츠(핵심요약/장단점/후기 등)는 아직 도시마다 준비되어 있지 않아
 * 베를린 리포트를 템플릿으로 재사용하고, 카탈로그에 있는 값만 도시별로 덮어씀
 */
export function buildCityReportData(city: CityInsightData): CityReportData {
  return {
    ...berlinReportData,
    cityName: city.cityName,
    heroImageUrl: city.imageUrl,
    ratingBadge: city.rating,
    totalScore: city.rating,
    oneLineSummary: city.description,
  };
}
