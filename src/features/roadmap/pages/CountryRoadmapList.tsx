import { useEffect, useState } from 'react';
import Header from '../../../shared/components/Header';
import CategoryTab from '../../../shared/components/CategoryTab';
import CountryGroupHeader from '../components/CountryGroupHeader';
import CityRoadmapCard from '../components/CityRoadmapCard';
import EmptyStateIcon from '../components/EmptyStateIcon';
import PageNavigation from '../components/PageNavigation';
import LargeFillButton from '../components/LargeFillButton';
import Footer from '../../../shared/components/Footer';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import DeleteRoadmapModal from '../components/DeleteRoadmapModal';
import RoadmapRemovedToast from '../components/RoadmapRemovedToast';
import type { CityRoadmapData, CountryGroupData } from '../types/roadmap';

type RemovedRecord = {
  city: CityRoadmapData;
  countryName: string;
  index: number;
};

type CountryRoadmapListProps = {
  countryGroups: CountryGroupData[];
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onViewRoadmap?: (city: CityRoadmapData) => void;
  /** 지정하면 도시가 하나도 선택 안 된 상태(F-501)의 "도시 탐색하러 가기" 버튼 클릭 시 호출 */
  onExploreCity?: () => void;
};

export default function CountryRoadmapList({
  countryGroups,
  currentPage,
  totalPages,
  onPageChange,
  onViewRoadmap,
  onExploreCity,
}: CountryRoadmapListProps) {
  const [groups, setGroups] = useState<CountryGroupData[]>(countryGroups);
  const [activeTab, setActiveTab] = useState(0);
  const [wishedCityNames, setWishedCityNames] = useState<Set<string>>(
    () =>
      new Set(
        countryGroups.flatMap((group) => group.cities).filter((city) => city.isWished).map((city) => city.cityName),
      ),
  );
  const [deleteTarget, setDeleteTarget] = useState<CityRoadmapData | null>(null);
  const [removedRecord, setRemovedRecord] = useState<RemovedRecord | null>(null);

  useEffect(() => {
    setGroups(countryGroups);
  }, [countryGroups]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (!removedRecord) return;
    const timer = setTimeout(() => setRemovedRecord(null), 5000);
    return () => clearTimeout(timer);
  }, [removedRecord]);

  const toggleWish = (cityName: string) => {
    setWishedCityNames((prev) => {
      const next = new Set(prev);
      if (next.has(cityName)) next.delete(cityName);
      else next.add(cityName);
      return next;
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const group = groups.find((g) => g.countryName === deleteTarget.countryName);
    const cityIndex = group?.cities.findIndex((c) => c.cityName === deleteTarget.cityName) ?? -1;
    if (!group || cityIndex === -1) {
      setDeleteTarget(null);
      return;
    }
    setGroups((prev) =>
      prev.map((g) =>
        g.countryName === deleteTarget.countryName
          ? { ...g, cities: g.cities.filter((c) => c.cityName !== deleteTarget.cityName), cityCount: g.cityCount - 1 }
          : g,
      ),
    );
    setRemovedRecord({ city: deleteTarget, countryName: deleteTarget.countryName, index: cityIndex });
    setDeleteTarget(null);
  };

  const handleUndo = () => {
    if (!removedRecord) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.countryName === removedRecord.countryName
          ? {
              ...g,
              cities: [
                ...g.cities.slice(0, removedRecord.index),
                removedRecord.city,
                ...g.cities.slice(removedRecord.index),
              ],
              cityCount: g.cityCount + 1,
            }
          : g,
      ),
    );
    setRemovedRecord(null);
  };

  const wishedCities = groups.flatMap((group) => group.cities).filter((city) => wishedCityNames.has(city.cityName));
  const isEmpty = groups.length === 0 || (activeTab === 1 && wishedCities.length === 0);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header isLoggedIn={false} />

      {removedRecord && (
        <RoadmapRemovedToast cityName={removedRecord.city.cityName} onUndo={handleUndo} onClose={() => setRemovedRecord(null)} />
      )}

      <div className="mx-auto flex w-full max-w-content flex-col items-start gap-8 py-10">
        <CategoryTab categories={['나라별 로드맵', '위시 리스트']} activeIndex={activeTab} onChange={setActiveTab} />

        {groups.length === 0 ? (
          <div className="flex w-full flex-col items-center gap-4 py-20">
            <EmptyStateIcon />
            <div className="flex flex-col items-center gap-1">
              <p className="title-02 text-gray-700">선택된 도시가 없습니다</p>
              <p className="body-02 text-gray-500">준비를 시작할 도시를 선택해주세요</p>
            </div>
            <div className="w-89.5">
              <LargeFillButton label="도시 탐색하러 가기" onClick={onExploreCity} />
            </div>
          </div>
        ) : activeTab === 0 ? (
          <div className="flex w-full flex-col gap-[50px]">
            {groups.map((group) => (
              <div key={group.countryName} className="flex w-full flex-col gap-3">
                <CountryGroupHeader countryName={group.countryName} cityCount={group.cityCount} />
                <div className="flex w-full flex-wrap items-center gap-5">
                  {group.cities.map((city) => (
                    <CityRoadmapCard
                      key={city.cityName}
                      {...city}
                      isWished={wishedCityNames.has(city.cityName)}
                      onToggleWish={() => toggleWish(city.cityName)}
                      onViewRoadmap={() => onViewRoadmap?.(city)}
                      onDelete={() => setDeleteTarget(city)}
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
                onDelete={() => setDeleteTarget(city)}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-4 py-20">
            <EmptyStateIcon />
            <p className="body-02 text-gray-500">아직 위시리스트에 담은 도시가 없어요</p>
          </div>
        )}

        {!isEmpty && (
          <div className="flex w-full justify-center pt-25">
            <PageNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        )}
      </div>

      <Footer />

      {deleteTarget && (
        <ModalOverlay onClose={() => setDeleteTarget(null)}>
          <DeleteRoadmapModal
            cityName={deleteTarget.cityName}
            onCancel={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
