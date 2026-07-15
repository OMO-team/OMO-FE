import { useState } from 'react';
import CountryRoadmapList from './CountryRoadmapList';
import RoadmapDetail from './RoadmapDetail';
import { countryRoadmapGroups } from '../mocks/mockData';
import type { CityRoadmapData } from '../types/roadmap';

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
