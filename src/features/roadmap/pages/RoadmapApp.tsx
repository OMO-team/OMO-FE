import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CountryRoadmapList from './CountryRoadmapList';
import { roadmapsApi } from '../api/roadmapsApi';
import { wishlistApi } from '../api/wishlistApi';
import { roadmapQueryKeys, wishlistQueryKeys } from '../api/queryKeys';
import { toCityInsightData } from '../utils/wishlistAdapter';
import { groupByCountry } from '../utils/roadmapAdapter';
import type { CityListResult, RoadmapListItem } from '../types/api';

const GROUPS_PER_PAGE = 2;

export default function RoadmapApp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  /** 삭제 토스트의 "실행 취소" 창이 끝나기 전까지는 실 삭제 API를 호출하지 않기 위해 잠시 보관 */
  const lastRemovedRoadmapItem = useRef<RoadmapListItem | null>(null);

  const { data: roadmapItems = [] } = useQuery({
    queryKey: roadmapQueryKeys.list,
    queryFn: roadmapsApi.list,
  });

  const { data: wishlistResult } = useQuery({
    queryKey: wishlistQueryKeys.list,
    queryFn: wishlistApi.list,
  });
  const wishlistCities = useMemo(() => (wishlistResult?.cities ?? []).map(toCityInsightData), [wishlistResult]);

  const countryGroups = useMemo(() => groupByCountry(roadmapItems), [roadmapItems]);
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

  const handleDeleteCity = (cityId: string) => {
    const target = roadmapItems.find((item) => String(item.cityId) === cityId);
    if (!target) return;
    lastRemovedRoadmapItem.current = target;
    queryClient.setQueryData<RoadmapListItem[]>(roadmapQueryKeys.list, (prev) =>
      (prev ?? []).filter((item) => String(item.cityId) !== cityId),
    );
  };

  const handleRestoreCity = () => {
    const item = lastRemovedRoadmapItem.current;
    if (!item) return;
    queryClient.setQueryData<RoadmapListItem[]>(roadmapQueryKeys.list, (prev) => [...(prev ?? []), item]);
    lastRemovedRoadmapItem.current = null;
  };

  /** 실행 취소 창(5초)이 그냥 지나가거나 토스트를 닫으면 그제서야 실제 삭제를 확정 */
  const handleCommitDeleteCity = useCallback(() => {
    const item = lastRemovedRoadmapItem.current;
    if (!item) return;
    lastRemovedRoadmapItem.current = null;
    removeRoadmapMutation.mutate(item.roadmapId, {
      onError: (error) => {
        console.error('로드맵 삭제 실패', error);
        queryClient.setQueryData<RoadmapListItem[]>(roadmapQueryKeys.list, (prev) => [...(prev ?? []), item]);
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
