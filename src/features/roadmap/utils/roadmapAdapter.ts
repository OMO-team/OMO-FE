import { CITY_INFO_KO } from '../mocks/cityCountryMap';
import type { RoadmapListItem } from '../types/api';
import type { CityRoadmapData, CountryGroupData } from '../types/roadmap';

/** 로드맵 목록 API(RoadmapListItem)를 CityRoadmapCard가 쓰는 CityRoadmapData로 변환 */
function toCityRoadmapData(item: RoadmapListItem): CityRoadmapData {
  const cityInfo = CITY_INFO_KO[item.cityId];
  return {
    cityId: String(item.cityId),
    roadmapId: item.roadmapId,
    // 목록 API가 도시명/국가명을 영문으로만 줘서 시드 데이터 기반 한글 매핑으로 표시명을 채우고,
    // 매핑에 없는 도시는 '준비중' 같은 가짜 이름 대신 API가 준 영문 이름을 그대로 쓴다
    cityName: cityInfo?.cityName ?? item.cityName,
    countryName: cityInfo?.countryName ?? item.country.name,
    purposeId: item.purposeId,
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

/**
 * 목록 API가 평평한 배열로 내려주므로 국가별 그룹화는 프론트에서 수행.
 * 표시명이 아니라 countryId로 묶는다 — 표시명으로 묶으면 한글 매핑에 없는 도시들이
 * 같은 폴백 문자열을 공유하면서 서로 다른 국가인데도 한 그룹으로 뭉쳐버린다.
 */
export function groupByCountry(items: RoadmapListItem[]): CountryGroupData[] {
  const grouped = new Map<number, CountryGroupData>();

  items.forEach((item) => {
    const city = toCityRoadmapData(item);
    const group = grouped.get(item.country.countryId) ?? {
      countryName: city.countryName,
      cityCount: 0,
      cities: [],
    };
    group.cities.push(city);
    group.cityCount = group.cities.length;
    grouped.set(item.country.countryId, group);
  });

  return Array.from(grouped.values());
}
