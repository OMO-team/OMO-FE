import type { CityReportData } from '../../../shared/types/cityReport';
import type { CityInsightData } from '../types/cityInsight';

/** AI 맞춤 검색 입력창 아래에 놓이는 추천 질문 — 도시와 무관하게 동일하다 */
const SEARCH_KEYWORDS = ['비자 신청 절차', '주거비용', '아르바이트 구하기', '보험 가입', '여행지 추천'];

/**
 * 위시리스트/로드맵의 도시 정보를 AI 리포트 모달이 받는 형태로 변환.
 * 핵심요약·장단점·브이로그 같은 상세 콘텐츠는 모달이 cityId로 직접 조회하므로 여기서 채우지 않는다.
 */
export function buildCityReportData(city: CityInsightData): CityReportData {
  return {
    cityId: Number(city.cityId),
    cityName: city.cityName,
    heroImageUrl: city.imageUrl,
    ratingBadge: city.rating,
    totalScore: city.rating,
    oneLineSummary: city.description,
    searchKeywords: SEARCH_KEYWORDS,
    // 모달이 useCityResources로 직접 받아오는 값이라 비워 둔다
    vlogs: [],
    reviews: [],
  };
}
