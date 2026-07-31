import type { RoadmapListItem } from '../types/api';
import type { CityRoadmapData, CountryGroupData } from '../types/roadmap';

/** 로드맵 목록 API(RoadmapListItem)를 CityRoadmapCard가 쓰는 CityRoadmapData로 변환 */
function toCityRoadmapData(item: RoadmapListItem): CityRoadmapData {
  return {
    cityId: String(item.cityId),
    roadmapId: item.roadmapId,
    cityName: item.cityName,
    countryName: item.countryName,
    // progressRate가 이미 0~100 퍼센트 값이라는 가정 하에 사용 — 실 데이터로 검증 필요
    progressPercent: item.progressRate,
    costProgressPercent: item.progressRate,
    description: '준비중',
    rating: 0,
    completedSteps: item.completedTaskCount,
    totalSteps: item.totalTaskCount,
    nextSchedule: item.nextTaskName ?? '예정된 일정 없음',
    imageUrl: item.cityImageUrl,
  };
}

/** 목록 API가 평평한 배열로 내려주므로, countryName 기준으로 국가별 그룹화를 프론트에서 수행 */
export function groupByCountry(items: RoadmapListItem[]): CountryGroupData[] {
  const grouped = new Map<string, CityRoadmapData[]>();

  items.forEach((item) => {
    const cities = grouped.get(item.countryName) ?? [];
    cities.push(toCityRoadmapData(item));
    grouped.set(item.countryName, cities);
  });

  return Array.from(grouped.entries()).map(([countryName, cities]) => ({
    countryName,
    cityCount: cities.length,
    cities,
  }));
}
