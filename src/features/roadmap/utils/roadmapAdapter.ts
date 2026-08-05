import { CITY_INFO_KO } from '../mocks/cityCountryMap';
import type { RoadmapListItem } from '../types/api';
import type { CityRoadmapData, CountryGroupData } from '../types/roadmap';

const NOT_READY = '준비중';

/** 로드맵 목록 API(RoadmapListItem)를 CityRoadmapCard가 쓰는 CityRoadmapData로 변환 */
function toCityRoadmapData(item: RoadmapListItem): CityRoadmapData {
  const cityInfo = CITY_INFO_KO[item.cityId];
  return {
    cityId: String(item.cityId),
    roadmapId: item.roadmapId,
    // 목록 API가 도시명은 영문으로, country 정보는 아예 안 내려줘서 시드 데이터 기반 한글 매핑으로 대신 채움
    cityName: cityInfo?.cityName ?? item.cityName,
    countryName: cityInfo?.countryName ?? NOT_READY,
    purposeName: item.purposeName,
    // progressRate는 0~100 퍼센트 값(실 데이터로 확인됨) — 소수점이 길게 내려와서 반올림
    progressPercent: Math.round(item.progressRate),
    costProgressPercent: Math.round(item.progressRate),
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
    const city = toCityRoadmapData(item);
    const cities = grouped.get(city.countryName) ?? [];
    cities.push(city);
    grouped.set(city.countryName, cities);
  });

  return Array.from(grouped.entries()).map(([countryName, cities]) => ({
    countryName,
    cityCount: cities.length,
    cities,
  }));
}
