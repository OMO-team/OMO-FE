import { useState } from 'react';
import Header from '../../components/common/Header';
import CategoryTab from '../../components/common/CategoryTab';
import CountryGroupHeader from '../../components/roadmap/CountryGroupHeader';
import CityRoadmapCard from '../../components/roadmap/CityRoadmapCard';
import EmptyStateIcon from '../../components/roadmap/EmptyStateIcon';
import PageNavigation from '../../components/common/PageNavigation';
import Footer from '../../components/common/Footer';
import type { CityRoadmapData, CountryGroupData } from '../../components/types/roadmap';

type CountryRoadmapListProps = {
  countryGroups: CountryGroupData[];
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onViewRoadmap?: (city: CityRoadmapData) => void;
};

export default function CountryRoadmapList({
  countryGroups,
  currentPage,
  totalPages,
  onPageChange,
  onViewRoadmap,
}: CountryRoadmapListProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [wishedCityNames, setWishedCityNames] = useState<Set<string>>(
    () =>
      new Set(
        countryGroups.flatMap((group) => group.cities).filter((city) => city.isWished).map((city) => city.cityName),
      ),
  );

  const toggleWish = (cityName: string) => {
    setWishedCityNames((prev) => {
      const next = new Set(prev);
      if (next.has(cityName)) next.delete(cityName);
      else next.add(cityName);
      return next;
    });
  };

  const wishedCities = countryGroups.flatMap((group) => group.cities).filter((city) => wishedCityNames.has(city.cityName));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <div className="mx-auto flex w-full max-w-content flex-col items-start gap-8 px-4 py-10">
        <CategoryTab categories={['나라별 로드맵', '위시 리스트']} activeIndex={activeTab} onChange={setActiveTab} />

        {activeTab === 0 ? (
          <div className="flex w-full flex-col gap-[50px]">
            {countryGroups.map((group) => (
              <div key={group.countryName} className="flex w-full flex-col gap-3">
                <CountryGroupHeader countryName={group.countryName} cityCount={group.cityCount} />
                <div className="flex w-full items-center gap-5">
                  {group.cities.map((city) => (
                    <CityRoadmapCard
                      key={city.cityName}
                      {...city}
                      isWished={wishedCityNames.has(city.cityName)}
                      onToggleWish={() => toggleWish(city.cityName)}
                      onViewRoadmap={() => onViewRoadmap?.(city)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : wishedCities.length > 0 ? (
          <div className="flex w-full flex-wrap items-center gap-5">
            {wishedCities.map((city) => (
              <CityRoadmapCard
                key={city.cityName}
                {...city}
                isWished
                onToggleWish={() => toggleWish(city.cityName)}
                onViewRoadmap={() => onViewRoadmap?.(city)}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-4 py-20">
            <EmptyStateIcon />
            <p className="body-02 text-gray-500">아직 위시리스트에 담은 도시가 없어요</p>
          </div>
        )}

        <div className="flex w-full justify-center pt-[100px]">
          <PageNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
