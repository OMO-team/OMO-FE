import { useState } from 'react';
import CountryRoadmapList from './CountryRoadmapList';
import RoadmapDetail from './RoadmapDetail';
import { countryRoadmapGroups } from '../../components/roadmap/mockData';
import type { CityRoadmapData } from '../../components/types/roadmap';

export default function RoadmapApp() {
  const [selectedCity, setSelectedCity] = useState<CityRoadmapData | null>(null);

  if (selectedCity) {
    return <RoadmapDetail city={selectedCity} onBack={() => setSelectedCity(null)} />;
  }

  return (
    <CountryRoadmapList
      countryGroups={countryRoadmapGroups}
      currentPage={1}
      totalPages={1}
      onViewRoadmap={setSelectedCity}
    />
  );
}
