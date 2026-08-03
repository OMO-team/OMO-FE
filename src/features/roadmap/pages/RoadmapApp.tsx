import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CountryRoadmapList from './CountryRoadmapList';
import { roadmapsApi } from '../api/roadmapsApi';
import { wishlistApi } from '../api/wishlistApi';
import { roadmapQueryKeys, wishlistQueryKeys } from '../api/queryKeys';
import { toCityInsightData } from '../utils/wishlistAdapter';
import { groupByCountry } from '../utils/roadmapAdapter';
import { useAuthStore } from '../../auth/store/useAuthStore';
import type { CityListResult, RoadmapListItem } from '../types/api';

const GROUPS_PER_PAGE = 2;

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
    queryKey: [...roadmapQueryKeys.list, isLoggedIn],
    queryFn: roadmapsApi.list,
  });
  const visibleRoadmapItems = useMemo(
    () => roadmapItems.filter((item) => !pendingDeleteRoadmapIds.has(item.roadmapId)),
    [roadmapItems, pendingDeleteRoadmapIds],
  );

  const { data: wishlistResult } = useQuery({
    queryKey: [...wishlistQueryKeys.list, isLoggedIn],
    queryFn: wishlistApi.list,
  });
  const wishlistCities = useMemo(() => (wishlistResult?.cities ?? []).map(toCityInsightData), [wishlistResult]);

  const countryGroups = useMemo(() => groupByCountry(visibleRoadmapItems), [visibleRoadmapItems]);
  const wishedCityIds = useMemo(() => new Set(wishlistCities.map((city) => city.cityId)), [wishlistCities]);

  const totalPages = Math.max(1, Math.ceil(countryGroups.length / GROUPS_PER_PAGE));
  const pagedGroups = useMemo(
    () => countryGroups.slice((currentPage - 1) * GROUPS_PER_PAGE, currentPage * GROUPS_PER_PAGE),
    [countryGroups, currentPage],
  );

  const addWishMutation = useMutation({
    mutationFn: (cityId: number) => wishlistApi.add(cityId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: wishlistQueryKeys.list }),
  });

  /** 제거는 실패할 일이 거의 없어 낙관적으로 먼저 반영하고, 실패하면 되돌림 */
  const removeWishMutation = useMutation({
    mutationFn: (cityId: number) => wishlistApi.remove(cityId),
    onMutate: async (cityId) => {
      await queryClient.cancelQueries({ queryKey: wishlistQueryKeys.list });
      const previous = queryClient.getQueryData<CityListResult>(wishlistQueryKeys.list);
      queryClient.setQueryData<CityListResult>(wishlistQueryKeys.list, (old) =>
        old ? { ...old, cities: old.cities.filter((city) => city.cityId !== cityId) } : old,
      );
      return { previous };
    },
    onError: (_error, _cityId, context) => {
      if (context?.previous) queryClient.setQueryData(wishlistQueryKeys.list, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: wishlistQueryKeys.list }),
  });

  /** 하트 on = 위시리스트 등록, 하트 off = 위시리스트에서 제거 */
  const handleToggleWish = (cityId: string) => {
    const numericCityId = Number(cityId);
    if (wishedCityIds.has(cityId)) {
      removeWishMutation.mutate(numericCityId);
    } else {
      addWishMutation.mutate(numericCityId);
    }
  };

  const removeRoadmapMutation = useMutation({
    mutationFn: (roadmapId: number) => roadmapsApi.remove(roadmapId),
  });

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
      onSuccess: () => queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.list }),
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
    <CountryRoadmapList
      countryGroups={pagedGroups}
      wishlistCities={wishlistCities}
      wishedCityIds={wishedCityIds}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onViewRoadmap={(city) => city.roadmapId != null && navigate(`/myhome/dashboard/${city.roadmapId}`)}
      onToggleWish={handleToggleWish}
      onDeleteCity={handleDeleteCity}
      onRestoreCity={handleRestoreCity}
      onCommitDeleteCity={handleCommitDeleteCity}
    />
  );
}
