import { useEffect, useState } from 'react';
import Header from '../../../shared/components/Header';
import CategoryTab from '../../../shared/components/CategoryTab';
import CityInsightCard from '../../city-insight/components/CityInsightCard';
import CountryGroupHeader from '../components/CountryGroupHeader';
import CityRoadmapCard from '../components/CityRoadmapCard';
import EmptyStateIcon from '../components/EmptyStateIcon';
import PageNavigation from '../../../shared/components/PageNavigation';
import LargeFillButton from '../../../shared/components/LargeFillButton';
import Footer from '../../../shared/components/Footer';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import DeleteRoadmapModal from '../components/DeleteRoadmapModal';
import RoadmapRemovedToast from '../components/RoadmapRemovedToast';
import { useCompareStore } from '../../compare/store/useCompareStore';
import CompareSelectionBar from '../../compare/components/CompareSelectionBar';
import CompareModal from '../../compare/components/CompareModal';
import CityReportModal from '../../city-ai-report/components/CityReportModal';
import { mockSearchResult } from '../../city-ai-report/mocks/mockData';
import { toCompareCity } from '../utils/compareAdapter';
import { buildCityReportData } from '../utils/buildCityReportData';
import type { CityRoadmapData, CountryGroupData } from '../types/roadmap';
import type { CityInsightData } from '../types/cityInsight';

type RemovedRecord = {
  city: CityRoadmapData;
  countryName: string;
  index: number;
};

type RemovedWish = {
  cityId: string;
  cityName: string;
};

type CountryRoadmapListProps = {
  countryGroups: CountryGroupData[];
  /** 준비 시작 전 관심 도시를 보관하는 위시리스트 — 로드맵과 별도로 관리되는 경량 목록 */
  wishlistCities: CityInsightData[];
  wishedCityIds: Set<string>;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onViewRoadmap?: (city: CityRoadmapData) => void;
  /** 지정하면 도시가 하나도 선택 안 된 상태(F-501)의 "도시 탐색하러 가기" 버튼 클릭 시 호출 */
  onExploreCity?: () => void;
  /** 하트 on = 위시리스트 등록, 하트 off = 위시리스트에서 제거 */
  onToggleWish?: (cityId: string) => void;
};

export default function CountryRoadmapList({
  countryGroups,
  wishlistCities,
  wishedCityIds,
  currentPage,
  totalPages,
  onPageChange,
  onViewRoadmap,
  onExploreCity,
  onToggleWish,
}: CountryRoadmapListProps) {
  const [groups, setGroups] = useState<CountryGroupData[]>(countryGroups);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<CityRoadmapData | null>(null);
  const [removedRecord, setRemovedRecord] = useState<RemovedRecord | null>(null);
  const [removedWish, setRemovedWish] = useState<RemovedWish | null>(null);
  const [reportCityId, setReportCityId] = useState<string | null>(null);

  const toggleCompare = useCompareStore((s) => s.toggleCompare);
  const closeCompareModal = useCompareStore((s) => s.closeModal);
  const compareCities = wishlistCities.map(toCompareCity);
  const reportCity = wishlistCities.find((city) => city.cityId === reportCityId) ?? null;

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

  useEffect(() => {
    if (!removedWish) return;
    const timer = setTimeout(() => setRemovedWish(null), 5000);
    return () => clearTimeout(timer);
  }, [removedWish]);

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

  /** 하트 클릭 시점의 위시 상태를 알고 있어야 "껐을 때만" 토스트를 띄울 수 있음 */
  const handleToggleWish = (cityId: string, cityName: string) => {
    if (wishedCityIds.has(cityId)) {
      setRemovedWish({ cityId, cityName });
    }
    onToggleWish?.(cityId);
  };

  const handleUndoWish = () => {
    if (!removedWish) return;
    onToggleWish?.(removedWish.cityId);
    setRemovedWish(null);
  };

  /** 비교 모달에서 도시를 선택하면 모달을 닫고 그 도시의 AI 리포트로 이어줌 */
  const handleSelectCompareCity = (cityId: string) => {
    closeCompareModal();
    setReportCityId(cityId);
  };

  const hasRoadmaps = groups.length > 0;
  const hasWishlist = wishlistCities.length > 0;
  /** 두 영역 모두 비어 있는 경우에만 통합 빈 상태(도시 탐색 유도 CTA) 노출 */
  const isAllEmpty = !hasRoadmaps && !hasWishlist;
  const isCurrentTabEmpty = activeTab === 0 ? !hasRoadmaps : !hasWishlist;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header isLoggedIn={false} />

      {removedRecord && (
        <RoadmapRemovedToast cityName={removedRecord.city.cityName} onUndo={handleUndo} onClose={() => setRemovedRecord(null)} />
      )}
      {removedWish && (
        <RoadmapRemovedToast
          cityName={removedWish.cityName}
          location="위시리스트"
          onUndo={handleUndoWish}
          onClose={() => setRemovedWish(null)}
        />
      )}

      <div className="mx-auto flex w-full max-w-content flex-col items-start gap-8 py-10">
        <CategoryTab categories={['나라별 로드맵', '위시 리스트']} activeIndex={activeTab} onChange={setActiveTab} />

        {isAllEmpty ? (
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
          hasRoadmaps ? (
            <div className="flex w-full flex-col gap-12.5">
              {groups.map((group) => (
                <div key={group.countryName} className="flex w-full flex-col gap-3">
                  <CountryGroupHeader countryName={group.countryName} cityCount={group.cityCount} />
                  <div className="flex w-full flex-wrap items-center gap-5">
                    {group.cities.map((city) => (
                      <CityRoadmapCard
                        key={city.cityId}
                        {...city}
                        isWished={wishedCityIds.has(city.cityId)}
                        onToggleWish={() => handleToggleWish(city.cityId, city.cityName)}
                        onViewRoadmap={() => onViewRoadmap?.(city)}
                        onDelete={() => setDeleteTarget(city)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-4 py-20">
              <EmptyStateIcon />
              <p className="body-02 text-gray-500">아직 시작한 로드맵이 없어요</p>
            </div>
          )
        ) : hasWishlist ? (
          <div className="grid w-full grid-cols-2 gap-5">
            {wishlistCities.map((city) => (
              <CityInsightCard
                key={city.cityId}
                {...city}
                isWished
                onToggleWish={() => handleToggleWish(city.cityId, city.cityName)}
                onCompare={() => toggleCompare(city.cityId)}
                onReport={() => setReportCityId(city.cityId)}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-4 py-20">
            <EmptyStateIcon />
            <p className="body-02 text-gray-500">아직 위시리스트에 담은 도시가 없어요</p>
          </div>
        )}

        {!isAllEmpty && !isCurrentTabEmpty && (
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

      <CompareSelectionBar cities={compareCities} />
      <CompareModal cities={compareCities} onSelectCity={handleSelectCompareCity} />

      {reportCity && (
        <CityReportModal
          isOpen
          onClose={() => setReportCityId(null)}
          data={buildCityReportData(reportCity)}
          onSearch={mockSearchResult}
        />
      )}
    </div>
  );
}
