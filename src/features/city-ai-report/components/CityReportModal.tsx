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
  /** 추가 실패 시 푸터에 표시할 문구 */
  addErrorMessage?: string | null;
}

export default function CityReportModal({
  isOpen,
  onClose,
  data,
  onSearch,
  onAddToRoadmap,
  isAddDisabled,
  addErrorMessage,
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
        // 900px 고정이면 브라우저 툴바 때문에 세로가 짧은 화면에서 하단 버튼이 잘린다.
        // 화면보다 커지지 않게 상한을 씌우면 본문만 스크롤되고 푸터는 항상 보인다.
        // @container: 이 박스는 폭이 콘텐츠가 아니라 w-[1040px]/max-w-[95vw]로 스스로 정해지므로,
        // 안쪽 고정 px 값들을 이 박스 실제 폭 기준 cqw로 비례 축소해도 순환 참조 없이 안전하다.
        className="@container w-[1040px] max-w-[95vw] h-[900px] max-h-[90vh] relative rounded-5 bg-white overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <CloseButton onClick={onClose} className="absolute top-6 right-6 z-10 shadow-02" />
        {/* overflow-x-auto: cqw로 줄어든 폭이 바닥값(floor)에 닿아도 더는 못 줄어드는 극단적으로 좁은 화면을 위한 안전장치 */}
        <div className="flex-1 flex flex-col justify-start items-center overflow-x-auto overflow-y-auto scrollbar-hide gap-10 pb-10">
          <ReportHero
            cityName={data.cityName}
            purposeName={data.purposeName}
            heroImageUrl={data.heroImageUrl}
            ratingBadge={data.ratingBadge}
          />
          {/* 폭 자체에 바닥값을 두면 박스가 그보다 좁아졌을 때 여백이 사라지고 콘텐츠가 넘친다.
              대신 좌우 여백(최소 24px, 최대 72px)을 기준으로 폭을 "박스 폭 - 여백*2"로 계산해
              화면이 아무리 좁아져도 여백이 항상 남아 있게 한다 */}
          <div className="flex w-[calc(100cqw_-_2*clamp(24px,6.923077cqw,72px))] flex-col items-start justify-start gap-9">
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
              {/* 두 컬럼이 각자의 floor까지 줄어도 안 맞으면 flex-wrap이 자동으로 세로 스택으로 전환.
                  grow: 나란히 있을 때는 남는 공간이 없어(432+448+gap=896=래퍼 폭) dev 원본 비율 그대로지만,
                  스택된 뒤에는 혼자 한 줄을 차지하므로 grow가 남은 폭을 그 컬럼에 채워 VLOG 등 내부
                  카드들이 다시 여러 개씩 배치될 공간이 생긴다 */}
              <div className="flex flex-wrap items-start justify-start self-stretch gap-[clamp(8px,1.538462cqw,16px)]">
                <div className="flex grow basis-[clamp(300px,41.538462cqw,432px)] flex-col items-start justify-start gap-[60px]">
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
                {/* floor를 332px(영상 2개 + 간격의 최소치, 160*2+12)로 올려서, 나란히 있는 채로는
                    VLOG가 절대 영상 1개짜리 폭까지 좁아지지 않게 함 — 그보다 더 좁아져야 하면
                    flex-wrap이 아예 장단점 아래로 내려버리고, 내려간 뒤엔 grow로 훨씬 넓어져
                    다시 2개가 들어간다 */}
                <div className="flex grow basis-[clamp(332px,43.076923cqw,448px)] flex-col items-start justify-start gap-5">
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
          errorMessage={addErrorMessage}
        />
      </div>
    </div>
  );
}
