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
import RoadmapAddedToast from '../components/RoadmapAddedToast';
import { useCompareStore } from '../../compare/store/useCompareStore';
import CompareSelectionBar from '../../compare/components/CompareSelectionBar';
import CompareModal from '../../compare/components/CompareModal';
import CityReportModal from '../../city-ai-report/components/CityReportModal';
import { cityAiReportApi } from '../../city-ai-report/api/cityAiReportApi';
import { buildCityReportData } from '../utils/buildCityReportData';
import { wishKey } from '../utils/wishlistAdapter';
import { getErrorMessage } from '../api/apiUtils';
import type { CityRoadmapData, CountryGroupData } from '../types/roadmap';
import type { CityInsightData } from '../types/cityInsight';
import type { CreateRoadmapResult } from '../types/api';

type RemovedRecord = {
  city: CityRoadmapData;
  countryName: string;
};

type RemovedWish = {
  cityId: string;
  cityName: string;
  /** 실행 취소로 다시 담을 때 같은 목적으로 넣어야 해서 함께 보관 */
  purposeId?: number;
};

type CountryRoadmapListProps = {
  countryGroups: CountryGroupData[];
  /** 준비 시작 전 관심 도시를 보관하는 위시리스트 — 로드맵과 별도로 관리되는 경량 목록 */
  wishlistCities: CityInsightData[];
  /** 위시 여부는 도시가 아니라 도시+목적 조합으로 판단 — wishKey()로 만든 키 집합 */
  wishedKeys: Set<string>;
  /** 이미 로드맵이 있는 도시+목적 조합 — 같은 조합이 두 번 생기지 않도록 추가 버튼을 잠그는 데 씀 */
  roadmapKeys: Set<string>;
  /** 비교 선택 바가 칩을 그릴 때 참고하는 도시 목록 — 비교함에 담길 수 있는 도시를 모두 포함해야 한다 */
  compareSelectableCities: { cityId: number; cityName: string }[];
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onViewRoadmap?: (city: CityRoadmapData) => void;
  /** 지정하면 도시가 하나도 선택 안 된 상태(F-501)의 "도시 탐색하러 가기" 버튼 클릭 시 호출 */
  onExploreCity?: () => void;
  /** 하트 on = 위시리스트 등록(목적 필요), 하트 off = 위시리스트에서 제거(목적 불필요) */
  onToggleWish?: (cityId: string, purposeId?: number) => void;
  /** 로드맵 삭제 확정 시 호출 (아직 실 삭제 API는 호출하지 않음 — onCommitDeleteCity에서 처리). 한 도시에 목적이 다른 로드맵이 여러 개 있을 수 있어 cityId 대신 roadmapId로 식별 */
  onDeleteCity?: (roadmapId: number) => void;
  /** 삭제 토스트의 "실행 취소" 클릭 시 호출 */
  onRestoreCity?: () => void;
  /** 삭제 토스트가 실행 취소 없이 사라질 때(타임아웃/닫기) 호출 — 이 시점에 실 삭제 API 호출 */
  onCommitDeleteCity?: () => void;
  /** 목적 선택 모달에서 목적을 고르면 호출 — 실패 시(지원 안 하는 목적 등) 에러 메시지를 그대로 보여주기 위해 throw를 그대로 전달받음 */
  onAddRoadmap?: (cityId: number, purposeId: number) => Promise<CreateRoadmapResult>;
  /** 로드맵 생성 완료 토스트의 "보러가기" 클릭 시 호출 */
  onViewCreatedRoadmap?: (roadmapId: number) => void;
};

export default function CountryRoadmapList({
  countryGroups,
  wishlistCities,
  wishedKeys,
  roadmapKeys,
  compareSelectableCities,
  currentPage,
  totalPages,
  onPageChange,
  onViewRoadmap,
  onExploreCity,
  onToggleWish,
  onDeleteCity,
  onRestoreCity,
  onCommitDeleteCity,
  onAddRoadmap,
  onViewCreatedRoadmap,
}: CountryRoadmapListProps) {
  const groups = countryGroups;
  const [activeTab, setActiveTab] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<CityRoadmapData | null>(null);
  const [removedRecord, setRemovedRecord] = useState<RemovedRecord | null>(null);
  const [removedWish, setRemovedWish] = useState<RemovedWish | null>(null);
  /** 같은 도시가 목적별로 여러 장 있을 수 있어 도시가 아니라 조합 키로 어느 카드의 리포트인지 식별 */
  const [reportCityKey, setReportCityKey] = useState<string | null>(null);
  const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
  const [addErrorMessage, setAddErrorMessage] = useState<string | null>(null);
  const [createdRoadmap, setCreatedRoadmap] = useState<{ roadmapId: number; cityName: string } | null>(null);
  /** 이미 추가한 도시는 리포트를 다시 열어도 버튼이 비활성 상태로 유지되도록 기억 */
  const [addedKeys, setAddedKeys] = useState<Set<string>>(new Set());
  /** 기본은 전부 펼친 상태 — 여기 담긴 국가만 접힌 상태로 표시 */
  const [collapsedCountries, setCollapsedCountries] = useState<Set<string>>(new Set());

  const toggleCompare = useCompareStore((s) => s.toggleCompare);
  const closeCompareModal = useCompareStore((s) => s.closeModal);
  const reportCity =
    wishlistCities.find((city) => wishKey(city.cityId, city.purposeId) === reportCityKey) ?? null;

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

  useEffect(() => {
    if (!createdRoadmap) return;
    const timer = setTimeout(() => setCreatedRoadmap(null), 5000);
    return () => clearTimeout(timer);
  }, [createdRoadmap]);

  const handleConfirmDelete = () => {
    if (!deleteTarget || deleteTarget.roadmapId == null) return;
    onDeleteCity?.(deleteTarget.roadmapId);
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
  const handleToggleWish = (cityId: string, cityName: string, purposeId?: number) => {
    if (wishedKeys.has(wishKey(cityId, purposeId))) {
      setRemovedWish({ cityId, cityName, purposeId });
    }
    onToggleWish?.(cityId, purposeId);
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
    onToggleWish?.(removedWish.cityId, removedWish.purposeId);
    setRemovedWish(null);
  };

  /** 비교 모달에서 도시를 선택하면 모달을 닫고 그 도시의 AI 리포트로 이어줌 (비교는 도시 단위라 목적이 여러 개면 첫 항목 기준) */
  const handleSelectCompareCity = (cityId: number) => {
    closeCompareModal();
    const matched = wishlistCities.find((city) => city.cityId === String(cityId));
    setReportCityKey(matched ? wishKey(matched.cityId, matched.purposeId) : null);
  };

  /**
   * AI 리포트의 "로드맵에 추가하기" — 목적은 위시리스트 항목이 들고 있으므로 따로 묻지 않고 바로 생성.
   * 성공하면 로드맵 목록 쿼리가 무효화되어 "나라별 로드맵" 탭에 새 카드가 자동 반영됨(탭은 직접 전환하지 않음).
   */
  const handleAddToRoadmap = async () => {
    if (!reportCity || !onAddRoadmap || isCreatingRoadmap) return;
    if (reportCity.purposeId == null) {
      setAddErrorMessage('이 도시의 목적 정보가 없어 로드맵을 만들 수 없어요.');
      return;
    }
    setIsCreatingRoadmap(true);
    setAddErrorMessage(null);
    try {
      const result = await onAddRoadmap(Number(reportCity.cityId), reportCity.purposeId);
      setAddedKeys((prev) => new Set(prev).add(wishKey(reportCity.cityId, reportCity.purposeId)));
      setCreatedRoadmap({ roadmapId: result.roadmapId, cityName: reportCity.cityName });
    } catch (error) {
      console.error('로드맵 생성 실패', error);
      setAddErrorMessage(
        getErrorMessage(error, '로드맵을 만들지 못했어요. 잠시 후 다시 시도해주세요.'),
      );
    } finally {
      setIsCreatingRoadmap(false);
    }
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
                            key={city.roadmapId ?? city.cityId}
                            {...city}
                            isWishlisted={wishedKeys.has(wishKey(city.cityId, city.purposeId))}
                            onToggleWish={() => handleToggleWish(city.cityId, city.cityName, city.purposeId)}
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
                key={wishKey(city.cityId, city.purposeId)}
                imageUrl={city.imageUrl}
                rating={city.rating}
                isWishlisted
                name={city.cityName}
                countryName={city.countryName}
                purposeName={city.purposeName}
                description={city.description}
                // city.monthlyCost는 "400만원"처럼 단위가 붙은 표시용 문자열이라 숫자만 뽑아서 넘김
                monthlyCost={Number(city.monthlyCost.replace(/[^0-9.]/g, '')) || 0}
                costPercent={city.costPercent}
                accommodationPercent={city.accommodationPercent}
                accommodationLabel={city.accommodationLabel}
                visaPercent={city.visaPercent}
                visaLabel={city.visaLabel}
                safetyScore={city.securityScore}
                languageScore={city.languageScore}
                internetScore={city.infrastructureScore}
                onToggleWish={() => handleToggleWish(city.cityId, city.cityName, city.purposeId)}
                onCompare={() => toggleCompare(Number(city.cityId))}
                onReport={() => { setAddErrorMessage(null); setReportCityKey(wishKey(city.cityId, city.purposeId)); }}
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

      <CompareSelectionBar cities={compareSelectableCities} />
      <CompareModal onSelectCity={handleSelectCompareCity} />

      {reportCity && (
        <CityReportModal
          isOpen
          onClose={() => { setReportCityKey(null); setAddErrorMessage(null); }}
          data={buildCityReportData(reportCity)}
          onSearch={(question) => cityAiReportApi.askQuestion(Number(reportCity.cityId), { question })}
          onAddToRoadmap={handleAddToRoadmap}
          isAddDisabled={
            isCreatingRoadmap ||
            addedKeys.has(wishKey(reportCity.cityId, reportCity.purposeId)) ||
            roadmapKeys.has(wishKey(reportCity.cityId, reportCity.purposeId))
          }
          addErrorMessage={addErrorMessage}
        />
      )}

      {createdRoadmap && (
        <RoadmapAddedToast
          cityName={createdRoadmap.cityName}
          onViewRoadmap={() => {
            onViewCreatedRoadmap?.(createdRoadmap.roadmapId);
            setCreatedRoadmap(null);
          }}
          onClose={() => setCreatedRoadmap(null)}
        />
      )}
    </div>
  );
}
