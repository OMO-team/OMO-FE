import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CountryRoadmapList from './CountryRoadmapList';
import SmartBriefingFAB from '../../../shared/components/SmartBriefingFAB';
import { roadmapsApi } from '../api/roadmapsApi';
import { wishlistApi } from '../api/wishlistApi';
import { citiesApi } from '../api/citiesApi';
import { cityQueryKeys, roadmapQueryKeys, wishlistQueryKeys } from '../api/queryKeys';
import { toCityInsightData, wishKey } from '../utils/wishlistAdapter';
import { groupByCountry, type CityCatalogMap } from '../utils/roadmapAdapter';
import { useAuthStore } from '../../auth/store/useAuthStore';
import type { WishlistCityListResult, CreateRoadmapResult, RoadmapListItem } from '../types/api';

const GROUPS_PER_PAGE = 2;
/** 도시 정보는 거의 바뀌지 않으므로 길게 캐시해서 화면 간에 공유한다 */
const CITY_CATALOG_STALE_TIME = 1000 * 60 * 60;

export default function RoadmapApp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  /** 삭제 토스트의 "실행 취소" 창이 끝나기 전까지는 실 삭제 API를 호출하지 않기 위해 잠시 보관 */
  const lastRemovedRoadmapItem = useRef<RoadmapListItem | null>(null);
  /**
   * 삭제 대기 중인 로드맵을 캐시에서 직접 지우는 대신 이 상태로 화면에서만 걸러냄 —
   * 캐시를 직접 지우면 TanStack Query가 백그라운드에서 자동 refetch할 때 서버의 원본 데이터로
   * 덮어써져서 "실행취소 창이 끝나기도 전에 삭제한 항목이 도로 나타나는" 문제가 생김
   */
  const [pendingDeleteRoadmapIds, setPendingDeleteRoadmapIds] = useState<Set<number>>(new Set());
  /** 로그인 상태를 쿼리 키에 포함시켜, 로그인 성공 시 새로고침 없이도 자동으로 다시 조회되도록 함 */
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const { data: roadmapItems = [] } = useQuery({
    queryKey: roadmapQueryKeys.list(isLoggedIn),
    queryFn: roadmapsApi.list,
  });
  const visibleRoadmapItems = useMemo(
    () => roadmapItems.filter((item) => !pendingDeleteRoadmapIds.has(item.roadmapId)),
    [roadmapItems, pendingDeleteRoadmapIds],
  );

  const { data: wishlistResult } = useQuery({
    queryKey: wishlistQueryKeys.list(isLoggedIn),
    queryFn: wishlistApi.list,
  });
  const wishlistCities = useMemo(() => (wishlistResult?.cities ?? []).map(toCityInsightData), [wishlistResult]);

  /** 로드맵 목록 API에 없는 도시 소개·평점을 채우기 위해 도시 카탈로그를 함께 조회 */
  const { data: cityCatalog } = useQuery({
    queryKey: cityQueryKeys.list,
    queryFn: citiesApi.list,
    staleTime: CITY_CATALOG_STALE_TIME,
  });
  const cityCatalogMap = useMemo<CityCatalogMap>(
    () => new Map((cityCatalog ?? []).map((city) => [city.cityId, city])),
    [cityCatalog],
  );

  const countryGroups = useMemo(
    () => groupByCountry(visibleRoadmapItems, cityCatalogMap),
    [visibleRoadmapItems, cityCatalogMap],
  );
  /**
   * 이미 로드맵이 있는 도시+목적 조합 — 같은 조합을 또 담지 못하게 막는 데 쓴다.
   * 현재 페이지의 그룹이 아니라 목록 전체로 만들어야 다른 페이지에 있는 로드맵도 걸린다.
   */
  const roadmapKeys = useMemo(
    () => new Set(visibleRoadmapItems.map((item) => wishKey(item.cityId, item.purposeId))),
    [visibleRoadmapItems],
  );
  /** 같은 도시라도 목적이 다르면 별개 항목이라 조합을 키로 씀 */
  const wishedKeys = useMemo(
    () => new Set(wishlistCities.map((city) => wishKey(city.cityId, city.purposeId))),
    [wishlistCities],
  );

  const totalPages = Math.max(1, Math.ceil(countryGroups.length / GROUPS_PER_PAGE));
  const pagedGroups = useMemo(
    () => countryGroups.slice((currentPage - 1) * GROUPS_PER_PAGE, currentPage * GROUPS_PER_PAGE),
    [countryGroups, currentPage],
  );

  const addWishMutation = useMutation({
    mutationFn: ({ cityId, purposeId }: { cityId: number; purposeId: number }) =>
      wishlistApi.add(cityId, purposeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishlistQueryKeys.all }),
  });

  /** 제거는 실패할 일이 거의 없어 낙관적으로 먼저 반영하고, 실패하면 되돌림 */
  const removeWishMutation = useMutation({
    mutationFn: ({ cityId, purposeId }: { cityId: number; purposeId: number }) =>
      wishlistApi.remove(cityId, purposeId),
    onMutate: async ({ cityId, purposeId }) => {
      await queryClient.cancelQueries({ queryKey: wishlistQueryKeys.list(isLoggedIn) });
      const previous = queryClient.getQueryData<WishlistCityListResult>(wishlistQueryKeys.list(isLoggedIn));
      queryClient.setQueryData<WishlistCityListResult>(wishlistQueryKeys.list(isLoggedIn), (old) =>
        old
          ? {
              ...old,
              // 같은 도시의 다른 목적 항목은 남겨야 하므로 조합으로 걸러냄
              cities: old.cities.filter(
                (city) => !(city.cityId === cityId && city.purposeId === purposeId),
              ),
            }
          : old,
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(wishlistQueryKeys.list(isLoggedIn), context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: wishlistQueryKeys.all }),
  });

  /** 하트 on = 위시리스트 등록, 하트 off = 제거 — 둘 다 도시+목적 조합으로 식별 */
  const handleToggleWish = (cityId: string, purposeId?: number) => {
    if (purposeId == null) {
      console.error('목적 없이는 위시리스트를 바꿀 수 없음', cityId);
      return;
    }
    const numericCityId = Number(cityId);
    if (wishedKeys.has(wishKey(cityId, purposeId))) {
      removeWishMutation.mutate({ cityId: numericCityId, purposeId });
      return;
    }
    addWishMutation.mutate({ cityId: numericCityId, purposeId });
  };

  const removeRoadmapMutation = useMutation({
    mutationFn: (roadmapId: number) => roadmapsApi.remove(roadmapId),
  });

  /** 목적 선택 모달이 로딩/에러 상태를 직접 다룰 수 있도록 Promise를 그대로 반환 */
  const handleCreateRoadmap = async (cityId: number, purposeId: number): Promise<CreateRoadmapResult> => {
    const result = await roadmapsApi.create({ cityId, purposeId });
    await queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.all });
    return result;
  };

  const handleDeleteCity = (roadmapId: number) => {
    const target = roadmapItems.find((item) => item.roadmapId === roadmapId);
    if (!target) return;
    lastRemovedRoadmapItem.current = target;
    setPendingDeleteRoadmapIds((prev) => new Set(prev).add(target.roadmapId));
  };

  const handleRestoreCity = () => {
    const item = lastRemovedRoadmapItem.current;
    if (!item) return;
    setPendingDeleteRoadmapIds((prev) => {
      const next = new Set(prev);
      next.delete(item.roadmapId);
      return next;
    });
    lastRemovedRoadmapItem.current = null;
  };

  /**
   * 실행 취소 창(5초)이 그냥 지나가거나 토스트를 닫으면 그제서야 실제 삭제를 확정.
   * 성공하면 이미 화면에서 숨긴 상태를 그대로 유지 — 굳이 재조회로 다시 보여줬다 지울 필요 없음(그게 깜빡임의 원인이었음).
   * 실패했을 때만 숨김을 풀어서 되돌림.
   */
  const handleCommitDeleteCity = useCallback(() => {
    const item = lastRemovedRoadmapItem.current;
    if (!item) return;
    lastRemovedRoadmapItem.current = null;

    removeRoadmapMutation.mutate(item.roadmapId, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.all }),
      onError: (error) => {
        console.error('로드맵 삭제 실패', error);
        setPendingDeleteRoadmapIds((prev) => {
          const next = new Set(prev);
          next.delete(item.roadmapId);
          return next;
        });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SmartBriefingFAB />
      <CountryRoadmapList
        countryGroups={pagedGroups}
        wishlistCities={wishlistCities}
        wishedKeys={wishedKeys}
        roadmapKeys={roadmapKeys}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewRoadmap={(city) => city.roadmapId != null && navigate(`/myhome/dashboard/${city.roadmapId}`)}
        // 목적 없이 들어가도 탐색 화면에 목적 탭이 있어 첫 목적이 선택된 상태로 시작한다
        onExploreCity={() => navigate('/city-insight')}
        onToggleWish={handleToggleWish}
        onDeleteCity={handleDeleteCity}
        onRestoreCity={handleRestoreCity}
        onCommitDeleteCity={handleCommitDeleteCity}
        onAddRoadmap={handleCreateRoadmap}
        onViewCreatedRoadmap={(roadmapId) => navigate(`/myhome/dashboard/${roadmapId}`)}
      />
    </>
  );
}
