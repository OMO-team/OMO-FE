import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountryRoadmapList from './CountryRoadmapList';
import { roadmapsApi } from '../api/roadmapsApi';
import { wishlistApi } from '../api/wishlistApi';
import { toCityInsightData } from '../utils/wishlistAdapter';
import { groupByCountry } from '../utils/roadmapAdapter';
import type { CityInsightData } from '../types/cityInsight';
import type { RoadmapListItem } from '../types/api';

const GROUPS_PER_PAGE = 2;

export default function RoadmapApp() {
  const navigate = useNavigate();
  const [roadmapItems, setRoadmapItems] = useState<RoadmapListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistCities, setWishlistCities] = useState<CityInsightData[]>([]);
  /** 삭제 토스트의 "실행 취소" 창이 끝나기 전까지는 실 삭제 API를 호출하지 않기 위해 잠시 보관 */
  const lastRemovedRoadmapItem = useRef<RoadmapListItem | null>(null);

  useEffect(() => {
    roadmapsApi
      .list()
      .then(setRoadmapItems)
      .catch((error) => console.error('로드맵 목록 조회 실패', error));
  }, []);

  useEffect(() => {
    wishlistApi
      .list()
      .then((result) => setWishlistCities(result.cities.map(toCityInsightData)))
      .catch((error) => console.error('위시리스트 조회 실패', error));
  }, []);

  const countryGroups = useMemo(() => groupByCountry(roadmapItems), [roadmapItems]);
  const wishedCityIds = useMemo(() => new Set(wishlistCities.map((city) => city.cityId)), [wishlistCities]);

  const totalPages = Math.max(1, Math.ceil(countryGroups.length / GROUPS_PER_PAGE));
  const pagedGroups = useMemo(
    () => countryGroups.slice((currentPage - 1) * GROUPS_PER_PAGE, currentPage * GROUPS_PER_PAGE),
    [countryGroups, currentPage],
  );

  /** 하트 on = 위시리스트 등록, 하트 off = 위시리스트에서 제거 — 먼저 화면에 반영하고 실패하면 서버 상태로 되돌림 */
  const handleToggleWish = async (cityId: string) => {
    const numericCityId = Number(cityId);
    const wasWished = wishedCityIds.has(cityId);

    if (wasWished) {
      setWishlistCities((prev) => prev.filter((city) => city.cityId !== cityId));
    }

    try {
      if (wasWished) {
        await wishlistApi.remove(numericCityId);
      } else {
        await wishlistApi.add(numericCityId);
        const { cities } = await wishlistApi.list();
        setWishlistCities(cities.map(toCityInsightData));
      }
    } catch (error) {
      console.error('위시리스트 변경 실패', error);
      const { cities } = await wishlistApi.list();
      setWishlistCities(cities.map(toCityInsightData));
    }
  };

  const handleDeleteCity = (cityId: string) => {
    const target = roadmapItems.find((item) => String(item.cityId) === cityId);
    if (!target) return;
    lastRemovedRoadmapItem.current = target;
    setRoadmapItems((prev) => prev.filter((item) => String(item.cityId) !== cityId));
  };

  const handleRestoreCity = () => {
    const item = lastRemovedRoadmapItem.current;
    if (!item) return;
    setRoadmapItems((prev) => [...prev, item]);
    lastRemovedRoadmapItem.current = null;
  };

  /** 실행 취소 창(5초)이 그냥 지나가거나 토스트를 닫으면 그제서야 실제 삭제를 확정 */
  const handleCommitDeleteCity = useCallback(async () => {
    const item = lastRemovedRoadmapItem.current;
    if (!item) return;
    lastRemovedRoadmapItem.current = null;
    try {
      await roadmapsApi.remove(item.roadmapId);
    } catch (error) {
      console.error('로드맵 삭제 실패', error);
      setRoadmapItems((prev) => [...prev, item]);
    }
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
