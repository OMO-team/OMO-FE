import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountryRoadmapList from './CountryRoadmapList';
import { cityInsightCatalog, initialWishedCityIds } from '../mocks/mockData';
import { useRoadmapStore } from '../store/useRoadmapStore';

const GROUPS_PER_PAGE = 2;

export default function RoadmapApp() {
  const navigate = useNavigate();
  const countryGroups = useRoadmapStore((s) => s.countryGroups);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishedCityIds, setWishedCityIds] = useState<Set<string>>(() => new Set(initialWishedCityIds));

  const totalPages = Math.max(1, Math.ceil(countryGroups.length / GROUPS_PER_PAGE));
  const pagedGroups = useMemo(
    () => countryGroups.slice((currentPage - 1) * GROUPS_PER_PAGE, currentPage * GROUPS_PER_PAGE),
    [countryGroups, currentPage],
  );
  const wishlistCities = useMemo(
    () => cityInsightCatalog.filter((city) => wishedCityIds.has(city.cityId)),
    [wishedCityIds],
  );

  /** 하트 on = 위시리스트 등록, 하트 off = 위시리스트에서 제거 */
  const handleToggleWish = (cityId: string) => {
    setWishedCityIds((prev) => {
      const next = new Set(prev);
      if (next.has(cityId)) next.delete(cityId);
      else next.add(cityId);
      return next;
    });
  };

  return (
    <CountryRoadmapList
      countryGroups={pagedGroups}
      wishlistCities={wishlistCities}
      wishedCityIds={wishedCityIds}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onViewRoadmap={(city) => navigate(`/myhome/dashboard/${city.cityId}`)}
      onToggleWish={handleToggleWish}
    />
  );
}
