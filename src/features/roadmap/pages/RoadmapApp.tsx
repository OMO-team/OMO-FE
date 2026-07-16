import { useMemo, useState } from 'react';
import CountryRoadmapList from './CountryRoadmapList';
import RoadmapDetail from './RoadmapDetail';
import { countryRoadmapGroups } from '../mocks/mockData';
import type { CityRoadmapData } from '../types/roadmap';

const GROUPS_PER_PAGE = 2;

export default function RoadmapApp() {
  const [selectedCity, setSelectedCity] = useState<CityRoadmapData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(countryRoadmapGroups.length / GROUPS_PER_PAGE));
  const pagedGroups = useMemo(
    () => countryRoadmapGroups.slice((currentPage - 1) * GROUPS_PER_PAGE, currentPage * GROUPS_PER_PAGE),
    [currentPage],
  );

  if (selectedCity) {
    return <RoadmapDetail city={selectedCity} onBack={() => setSelectedCity(null)} />;
  }

  return (
    <CountryRoadmapList
      countryGroups={pagedGroups}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      onViewRoadmap={setSelectedCity}
    />
  );
}
