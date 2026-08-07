import { instance } from '../../../lib/axios';
import { unwrap } from './apiUtils';
import type { ApiResponse, CityInfo, CityPageResult } from '../types/api';

/** 명세상 허용되는 최대 페이지 크기 — 요청 수를 줄이려고 최대치를 쓴다 */
const MAX_PAGE_SIZE = 100;

async function fetchCityPage(page: number): Promise<CityPageResult> {
  const { data } = await instance.get<ApiResponse<CityPageResult>>('/api/v1/cities', {
    params: { page, size: MAX_PAGE_SIZE },
  });
  return unwrap(data);
}

export const citiesApi = {
  /**
   * 도시 카탈로그 전체.
   * 단일 도시 조회 엔드포인트가 없어서 로드맵의 cityId로 이 목록에서 찾아 쓰는데,
   * 목록이 페이지네이션이라 모든 페이지를 모아서 돌려준다(266개 기준 3번).
   * 도시 정보는 거의 바뀌지 않으니 쿼리 캐시를 길게 잡고 화면 간에 공유한다.
   */
  list: async (): Promise<CityInfo[]> => {
    const firstPage = await fetchCityPage(0);
    if (firstPage.totalPages <= 1) return firstPage.data;

    const restPages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_, index) => fetchCityPage(index + 1)),
    );
    return [firstPage, ...restPages].flatMap((page) => page.data);
  },
};
