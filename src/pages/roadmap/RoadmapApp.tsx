import { useState } from 'react';
import CountryRoadmapList from './CountryRoadmapList';
import RoadmapDetail from './RoadmapDetail';
import ModalOverlay from '../../components/common/ModalOverlay';
import { countryRoadmapGroups } from '../../components/roadmap/mockData';
import type { CityRoadmapData } from '../../components/types/roadmap';

export default function RoadmapApp() {
  const [selectedCity, setSelectedCity] = useState<CityRoadmapData | null>(null);

  return (
    <>
      <CountryRoadmapList
        countryGroups={countryRoadmapGroups}
        currentPage={1}
        totalPages={1}
        onViewRoadmap={setSelectedCity}
      />

      {selectedCity && (
        <ModalOverlay onClose={() => setSelectedCity(null)}>
          <RoadmapDetail city={selectedCity} onBack={() => setSelectedCity(null)} />
        </ModalOverlay>
      )}
    </>
  );
}
