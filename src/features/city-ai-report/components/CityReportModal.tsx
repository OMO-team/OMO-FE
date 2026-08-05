import { useEffect } from 'react';
import ReportHero from './ReportHero';
import AISearchPanel from './AISearchPanel';
import ScoreSummary from './ScoreSummary';
import KeySummary from './KeySummary';
import KeyMetrics from './KeyMetrics';
import ProsCons from './ProsCons';
import VlogReviews from './VlogReviews';
import CityReportFooter from './CityReportFooter';
import CloseButton from '../../../shared/components/CloseButton';
import { useCityStats } from '../hooks/useCityStats';
import { useCityCoreSummaries } from '../hooks/useCityCoreSummaries';
import { useCityProsCons } from '../hooks/useCityProsCons';
import { useCityResources } from '../hooks/useCityResources';
import { toKeyMetrics } from '../utils/statsAdapter';
import type { AISearchResultData, CityReportData, KeySummaryItem } from '../../../shared/types/cityReport';

interface CityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CityReportData;
  onSearch: (query: string) => Promise<AISearchResultData>;
  onAddToRoadmap?: () => void;
  /** 추가가 끝났거나 진행 중이면 "로드맵에 추가하기" 버튼을 비활성화 */
  isAddDisabled?: boolean;
}

export default function CityReportModal({
  isOpen,
  onClose,
  data,
  onSearch,
  onAddToRoadmap,
  isAddDisabled,
}: CityReportModalProps) {
  const { data: stats } = useCityStats(data.cityId);
  const keyMetrics = stats ? toKeyMetrics(stats) : [];

  const { data: coreSummaries } = useCityCoreSummaries(data.cityId);
  const keySummary: KeySummaryItem[] =
    coreSummaries?.map((item) => ({
      id: item.category,
      title: item.title,
      description: item.content,
    })) ?? [];

  const { data: prosCons } = useCityProsCons(data.cityId);
  const showProsCons = !!prosCons && !(prosCons.prosEmpty && prosCons.consEmpty);

  const { data: vlogs } = useCityResources(data.cityId, { resourceType: 'VIDEO' });

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[1040px] h-[900px] relative rounded-5 bg-white overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <CloseButton onClick={onClose} className="absolute top-6 right-6 z-10 shadow-02" />
        <div className="flex-1 flex flex-col justify-start items-center overflow-y-auto scrollbar-hide gap-10 pb-10">
          <ReportHero
            cityName={data.cityName}
            heroImageUrl={data.heroImageUrl}
            ratingBadge={data.ratingBadge}
          />
          <div className="flex flex-col justify-start items-start w-[896px] gap-9">
            <AISearchPanel keywords={data.searchKeywords} onSearch={onSearch} />
            <div className="flex flex-col justify-start items-start self-stretch gap-9">
              <div className="flex flex-col justify-start items-start self-stretch gap-[30px]">
                <ScoreSummary
                  totalScore={data.totalScore}
                  cityName={data.cityName}
                  oneLineSummary={data.oneLineSummary}
                />
                <KeySummary items={keySummary} />
              </div>
              <div className="flex justify-start items-start self-stretch gap-4">
                <div className="flex flex-col justify-start items-start w-[432px] gap-[60px]">
                  <KeyMetrics metrics={keyMetrics} />
                  {showProsCons && (
                    <ProsCons
                      pros={prosCons!.pros}
                      cons={prosCons!.cons}
                      prosEmpty={prosCons!.prosEmpty}
                      consEmpty={prosCons!.consEmpty}
                    />
                  )}
                </div>
                <div className="flex flex-col justify-start items-start w-[448px] gap-5">
                  <VlogReviews vlogs={vlogs ?? []} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <CityReportFooter
          cityName={data.cityName}
          onAddToRoadmap={onAddToRoadmap}
          isAddDisabled={isAddDisabled}
        />
      </div>
    </div>
  );
}
