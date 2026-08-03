import { useEffect, useState } from 'react';
import CategoryTab from '../../../shared/components/CategoryTab';
import CityInsightCard from '../../city-insight/components/CityInsightCard';
import CountryGroupHeader from '../components/CountryGroupHeader';
import CityRoadmapCard from '../components/CityRoadmapCard';
import EmptyStateIcon from '../components/icons/EmptyStateIcon';
import PageNavigation from '../../../shared/components/PageNavigation';
import LargeFillButton from '../../../shared/components/LargeFillButton';
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
  /** 로드맵 삭제 확정 시 호출 (아직 실 삭제 API는 호출하지 않음 — onCommitDeleteCity에서 처리) */
  onDeleteCity?: (cityId: string) => void;
  /** 삭제 토스트의 "실행 취소" 클릭 시 호출 */
  onRestoreCity?: () => void;
  /** 삭제 토스트가 실행 취소 없이 사라질 때(타임아웃/닫기) 호출 — 이 시점에 실 삭제 API 호출 */
  onCommitDeleteCity?: () => void;
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
  onDeleteCity,
  onRestoreCity,
  onCommitDeleteCity,
}: CountryRoadmapListProps) {
  const groups = countryGroups;
  const [activeTab, setActiveTab] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<CityRoadmapData | null>(null);
  const [removedRecord, setRemovedRecord] = useState<RemovedRecord | null>(null);
  const [removedWish, setRemovedWish] = useState<RemovedWish | null>(null);
  const [reportCityId, setReportCityId] = useState<string | null>(null);
  /** 기본은 전부 펼친 상태 — 여기 담긴 국가만 접힌 상태로 표시 */
  const [collapsedCountries, setCollapsedCountries] = useState<Set<string>>(new Set());

  const toggleCompare = useCompareStore((s) => s.toggleCompare);
  const closeCompareModal = useCompareStore((s) => s.closeModal);
  const compareCities = wishlistCities.map(toCompareCity);
  const reportCity = wishlistCities.find((city) => city.cityId === reportCityId) ?? null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (!removedRecord) return;
    const timer = setTimeout(() => {
      setRemovedRecord(null);
      onCommitDeleteCity?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [removedRecord, onCommitDeleteCity]);

  useEffect(() => {
    /** 실행 취소 창이 끝나기 전에 페이지를 벗어나도 삭제가 유실되지 않도록, 언마운트 시 남아있는 삭제를 확정 */
    return () => onCommitDeleteCity?.();
  }, [onCommitDeleteCity]);

  useEffect(() => {
    if (!removedWish) return;
    const timer = setTimeout(() => setRemovedWish(null), 5000);
    return () => clearTimeout(timer);
  }, [removedWish]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    onDeleteCity?.(deleteTarget.cityId);
    setRemovedRecord({ city: deleteTarget, countryName: deleteTarget.countryName });
    setDeleteTarget(null);
  };

  const handleUndo = () => {
    if (!removedRecord) return;
    onRestoreCity?.();
    setRemovedRecord(null);
  };

  /** 실행 취소 없이 토스트를 직접 닫으면 삭제를 그대로 확정 */
  const handleCloseRemovedToast = () => {
    setRemovedRecord(null);
    onCommitDeleteCity?.();
  };

  /** 하트 클릭 시점의 위시 상태를 알고 있어야 "껐을 때만" 토스트를 띄울 수 있음 */
  const handleToggleWish = (cityId: string, cityName: string) => {
    if (wishedCityIds.has(cityId)) {
      setRemovedWish({ cityId, cityName });
    }
    onToggleWish?.(cityId);
  };

  const toggleCountryGroup = (countryName: string) => {
    setCollapsedCountries((prev) => {
      const next = new Set(prev);
      if (next.has(countryName)) next.delete(countryName);
      else next.add(countryName);
      return next;
    });
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
    <div className="flex flex-col bg-white">
      {removedRecord && (
        <RoadmapRemovedToast cityName={removedRecord.city.cityName} onUndo={handleUndo} onClose={handleCloseRemovedToast} />
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
              {groups.map((group) => {
                const isExpanded = !collapsedCountries.has(group.countryName);
                return (
                  <div key={group.countryName} className="flex w-full flex-col gap-3">
                    <CountryGroupHeader
                      countryName={group.countryName}
                      cityCount={group.cityCount}
                      isExpanded={isExpanded}
                      onToggle={() => toggleCountryGroup(group.countryName)}
                    />
                    {isExpanded && (
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
                    )}
                  </div>
                );
              })}
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
                imageUrl={city.imageUrl}
                rating={city.rating}
                isWishlisted
                name={city.cityName}
                countryName={city.countryName}
                description={city.description}
                monthlyCost={Number(city.monthlyCost)}
                costPercent={city.costPercent}
                accommodationPercent={city.accommodationPercent}
                accommodationLabel={city.accommodationLabel}
                visaPercent={city.visaPercent}
                visaLabel={city.visaLabel}
                safetyScore={city.securityScore}
                languageScore={city.languageScore}
                internetScore={city.infrastructureScore}
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

        {activeTab === 0 && !isAllEmpty && !isCurrentTabEmpty && (
          <div className="flex w-full justify-center pt-25">
            <PageNavigation currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        )}
      </div>

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
