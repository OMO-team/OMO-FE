import { CITY_INFO_KO } from '../mocks/cityCountryMap';
import type { CityInfo, RoadmapListItem } from '../types/api';
import type { CityRoadmapData, CountryGroupData } from '../types/roadmap';

const NOT_READY = '준비중';

/** cityId로 도시 카탈로그를 찾기 위한 조회표 — 로드맵 목록 API에 없는 설명·평점을 채우는 데 씀 */
export type CityCatalogMap = Map<number, CityInfo>;

/** 로드맵 목록 API(RoadmapListItem)를 CityRoadmapCard가 쓰는 CityRoadmapData로 변환 */
function toCityRoadmapData(item: RoadmapListItem, catalog?: CityCatalogMap): CityRoadmapData {
  const cityInfo = CITY_INFO_KO[item.cityId];
  const catalogCity = catalog?.get(item.cityId);
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
    // 로드맵 목록 API에는 도시 소개·평점이 없어서 도시 카탈로그에서 가져옴(못 받았으면 준비중으로 표시)
    description: catalogCity?.description ?? NOT_READY,
    rating: catalogCity?.rating ?? 0,
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
export function groupByCountry(items: RoadmapListItem[], catalog?: CityCatalogMap): CountryGroupData[] {
  const grouped = new Map<number, CountryGroupData>();

  items.forEach((item) => {
    const city = toCityRoadmapData(item, catalog);
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
