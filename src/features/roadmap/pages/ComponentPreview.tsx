import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import CityRoadmapCard from '../components/CityRoadmapCard';
import CityInsightCard from '../../city-insight/components/CityInsightCard';
import RequiredDocumentCard from '../components/RequiredDocumentCard';
import { useCompareStore } from '../../compare/store/useCompareStore';
import CompareSelectionBar from '../../compare/components/CompareSelectionBar';
import CompareModal from '../../compare/components/CompareModal';
import CityReportModal from '../../city-ai-report/components/CityReportModal';
import { berlinReportData, mockSearchResult } from '../../city-ai-report/mocks/mockData';
import { toCompareCity } from '../utils/compareAdapter';
import BagIcon from '../components/icons/BagIcon';
import CalendarIcon from '../components/icons/CalendarIcon';
import CameraIcon from '../components/icons/CameraIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import ChevronDownIcon from '../components/icons/ChevronDownIcon';
import CloudUploadIcon from '../components/icons/CloudUploadIcon';
import CsvFileIcon from '../components/icons/CsvFileIcon';
import DefaultFileIcon from '../components/icons/DefaultFileIcon';
import DocFileIcon from '../components/icons/DocFileIcon';
import DocumentDoneIcon from '../components/icons/DocumentDoneIcon';
import EditIcon from '../components/icons/EditIcon';
import FileClipIcon from '../components/icons/FileClipIcon';
import InfoCircleIcon from '../components/icons/InfoCircleIcon';
import LocationPinIcon from '../components/icons/LocationPinIcon';
import MinusStepperIcon from '../components/icons/MinusStepperIcon';
import MoneyIcon from '../components/icons/MoneyIcon';
import PdfFileIcon from '../components/icons/PdfFileIcon';
import PlusScheduleIcon from '../components/icons/PlusScheduleIcon';
import PlusStepperIcon from '../components/icons/PlusStepperIcon';
import RemoveIcon from '../components/icons/RemoveIcon';
import RoadmapTitleIcon from '../components/icons/RoadmapTitleIcon';
import TimelineLockIcon from '../components/icons/TimelineLockIcon';
import TimelineMissedIcon from '../components/icons/TimelineMissedIcon';
import TimelineOngoingIcon from '../components/icons/TimelineOngoingIcon';
import TimelineSuccessIcon from '../components/icons/TimelineSuccessIcon';
import TimelineUpcomingIcon from '../components/icons/TimelineUpcomingIcon';
import ToastCloseIcon from '../components/icons/ToastCloseIcon';
import TrashIcon from '../components/icons/TrashIcon';
import UploadIcon from '../components/icons/UploadIcon';
import UploadSpinnerIcon from '../components/icons/UploadSpinnerIcon';
import WarningIcon from '../components/icons/WarningIcon';
import TimeLineTaskCard from '../components/TimeLineTaskCard';
import BudgetPlanCard from '../components/BudgetPlanCard';
import CityHeroBanner from '../components/CityHeroBanner';
import RoadmapHeader from '../components/RoadmapHeader';
import RoadmapMonthSelector from '../components/RoadmapMonthSelector';
import RoadmapTimeline from '../components/RoadmapTimeline';
import DatePickerModal from '../components/DatePickerModal';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import EmptyStateIcon from '../components/EmptyStateIcon';
import RoadmapAlertCard from '../components/RoadmapAlertCard';
import AiReportCard from '../components/AiReportCard';
import RoadmapRemovedToast from '../components/RoadmapRemovedToast';
import DateAlertPill from '../components/DateAlertPill';
import DeleteRoadmapModal from '../components/DeleteRoadmapModal';
import CountryGroupHeader from '../components/CountryGroupHeader';
import LockOutlineIcon from '../components/icons/LockOutlineIcon';
import ScanFailIcon from '../components/icons/ScanFailIcon';
import CalendarErrorIcon from '../components/icons/CalendarErrorIcon';
import RoadmapDetailSkeleton from './RoadmapDetailSkeleton';
import CountryRoadmapListSkeleton from './CountryRoadmapListSkeleton';
import Header from '../../../shared/components/Header';
import BackHeader from '../../../shared/components/BackHeader';
import Footer from '../../../shared/components/Footer';
import NetworkErrorBanner from '../../../shared/components/NetworkErrorBanner';
import WifiOffIcon from '../../../shared/components/icons/WifiOffIcon';
import ServerErrorIcon from '../../../shared/components/icons/ServerErrorIcon';
import ClockDelayIcon from '../../../shared/components/icons/ClockDelayIcon';
import GaugeIcon from '../../../shared/components/icons/GaugeIcon';
import LargeFillButton from '../../../shared/components/LargeFillButton';
import PageNavigation from '../../../shared/components/PageNavigation';
import ConfirmActionModal from '../../../shared/components/ConfirmActionModal';
import AIPromptSection from '../../home/components/AIPromptSection';
import CategorySection from '../../home/components/CategorySection';
import {
  berlinRoadmapTasks,
  berlinBudgetPlan,
  berlinAiReport,
  apostilleRequiredDocuments,
  countryRoadmapGroups,
  documentUploadFiles,
  cityInsightCatalog,
} from '../mocks/mockData';

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="flex w-full max-w-350 flex-col gap-4 border-t border-gray-200 pt-8">
      <div className="flex items-baseline gap-3">
        <h2 className="heading-06 text-gray-900">{title}</h2>
        {note && <span className="body-04 text-gray-400">{note}</span>}
      </div>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  );
}

const ROADMAP_ICONS: { name: string; Icon: ComponentType<{ className?: string }> }[] = [
  { name: 'BagIcon', Icon: BagIcon },
  { name: 'CalendarErrorIcon', Icon: CalendarErrorIcon },
  { name: 'CalendarIcon', Icon: CalendarIcon },
  { name: 'CameraIcon', Icon: CameraIcon },
  { name: 'CheckCircleIcon', Icon: CheckCircleIcon },
  { name: 'ChevronDownIcon', Icon: ChevronDownIcon },
  { name: 'CloudUploadIcon', Icon: CloudUploadIcon },
  { name: 'CsvFileIcon', Icon: CsvFileIcon },
  { name: 'DefaultFileIcon', Icon: DefaultFileIcon },
  { name: 'DocFileIcon', Icon: DocFileIcon },
  { name: 'DocumentDoneIcon', Icon: DocumentDoneIcon },
  { name: 'EditIcon', Icon: EditIcon },
  { name: 'FileClipIcon', Icon: FileClipIcon },
  { name: 'InfoCircleIcon', Icon: InfoCircleIcon },
  { name: 'LocationPinIcon', Icon: LocationPinIcon },
  { name: 'LockOutlineIcon', Icon: LockOutlineIcon },
  { name: 'MinusStepperIcon', Icon: MinusStepperIcon },
  { name: 'MoneyIcon', Icon: MoneyIcon },
  { name: 'PdfFileIcon', Icon: PdfFileIcon },
  { name: 'PlusScheduleIcon', Icon: PlusScheduleIcon },
  { name: 'PlusStepperIcon', Icon: PlusStepperIcon },
  { name: 'RemoveIcon', Icon: RemoveIcon },
  { name: 'RoadmapTitleIcon', Icon: RoadmapTitleIcon },
  { name: 'ScanFailIcon', Icon: ScanFailIcon },
  { name: 'TimelineLockIcon', Icon: TimelineLockIcon },
  { name: 'TimelineMissedIcon', Icon: TimelineMissedIcon },
  { name: 'TimelineOngoingIcon', Icon: TimelineOngoingIcon },
  { name: 'TimelineSuccessIcon', Icon: TimelineSuccessIcon },
  { name: 'TimelineUpcomingIcon', Icon: TimelineUpcomingIcon },
  { name: 'ToastCloseIcon', Icon: ToastCloseIcon },
  { name: 'TrashIcon', Icon: TrashIcon },
  { name: 'UploadIcon', Icon: UploadIcon },
  { name: 'UploadSpinnerIcon', Icon: UploadSpinnerIcon },
  { name: 'WarningIcon', Icon: WarningIcon },
];

export default function ComponentPreview() {
  const [months, setMonths] = useState(berlinBudgetPlan.months);
  const [page, setPage] = useState(2);
  const [isCountryExpanded, setIsCountryExpanded] = useState(true);
  const cityCard = countryRoadmapGroups[0].cities[0];

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-gray-50 p-10">
      <Section title="Header" note="default(로그아웃/로그인) · overlay">
        <div className="flex w-full flex-col gap-3">
          <Header isLoggedIn={false} />
          <Header isLoggedIn={true} />
          <div className="rounded-2 bg-primary-800 py-2">
            <Header isLoggedIn={true} variant="overlay" />
          </div>
        </div>
      </Section>

      <Section title="BackHeader / RoadmapMonthSelector">
        <BackHeader title="이용약관 및 정책" />
        <RoadmapMonthSelector year={2026} month={4} />
      </Section>

      <Section title="AIPromptSection (내 홈)">
        <AIPromptSection />
      </Section>

      <Section title="CategorySection (내 홈)">
        <CategorySection />
      </Section>

      <Section title="CityHeroBanner / RoadmapHeader">
        <CityHeroBanner cityName="베를린" progressPercent={43} imageUrl={cityCard.imageUrl} />
        <RoadmapHeader year={2026} month={4} departureDate="2026년 06월 21일" />
      </Section>

      <Section title="CityRoadmapCard / CountryGroupHeader" note="expanded/collapsed 클릭으로 전환">
        <CityRoadmapCard {...cityCard} />
        <div className="flex w-100 flex-col gap-2">
          <CountryGroupHeader
            countryName="독일"
            cityCount={3}
            isExpanded={isCountryExpanded}
            onToggle={() => setIsCountryExpanded((v) => !v)}
          />
        </div>
      </Section>

      <Section title="TimeLineTaskCard" note="status: success/ongoing/upcoming/lock/missed — hover 직접 확인">
        <div className="flex flex-col gap-2">
          {berlinRoadmapTasks.map((task, i) => <TimeLineTaskCard key={`${task.title}-${i}`} {...task} />)}
        </div>
      </Section>

      <Section title="RoadmapTimeline">
        <RoadmapTimeline tasks={berlinRoadmapTasks} />
      </Section>

      <Section title="BudgetPlanCard / AiReportCard">
        <BudgetPlanCard {...berlinBudgetPlan} months={months} onMonthsChange={setMonths} />
        <AiReportCard {...berlinAiReport} />
      </Section>

      <Section title="DocumentTaskDetailModal" note="OCR 지원 서류는 '촬영하여 자동 체크' 버튼 클릭해서 시뮬레이션 확인 가능">
        <DocumentTaskDetailModalDemo />
      </Section>

      <Section title="DocumentUploadModal" note="uploading/completed/error 상태 동시 표시">
        <DocumentUploadModal files={documentUploadFiles} maxSizeMB={10} />
      </Section>

      <Section title="DatePickerModal" note="mode: day / month">
        <DatePickerModal mode="day" year={2026} month={4} selectedDay={15} />
        <DatePickerModal mode="month" year={2026} month={4} selectedMonth={4} />
      </Section>

      <Section title="DeleteRoadmapModal (ConfirmActionModal 재사용)">
        <DeleteRoadmapModal cityName="베를린" />
      </Section>

      <Section title="ConfirmActionModal (원본)">
        <ConfirmActionModal
          title="로그아웃 하시겠어요?"
          description={['다시 로그인하면 이어서 이용할 수 있어요.']}
          infoTitle="로그아웃 전 확인해 주세요."
          infoDetail={['진행 중인 작업 내용은 자동으로 저장돼요.']}
          cancelLabel="취소"
          confirmLabel="로그아웃"
        />
      </Section>

      <Section title="RoadmapRemovedToast" note="화면 상단 고정(fixed) 토스트라 여기서는 상대 위치로 감싸서 표시">
        <div className="relative flex h-16 w-full justify-center">
          <RoadmapRemovedToast cityName="베를린" />
        </div>
      </Section>

      <Section title="DateAlertPill">
        <DateAlertPill message="출국 예정일은 오늘 이후 날짜로 선택해 주세요." />
      </Section>

      <Section title="EmptyStateIcon">
        <EmptyStateIcon />
      </Section>

      <Section title="RoadmapAlertCard" note="에러/경고 카드 3종">
        <div className="grid w-181.5 grid-cols-2 gap-4">
          <RoadmapAlertCard
            icon={<LockOutlineIcon className="size-full" />}
            title="이전 단계를 먼저 완료해야 합니다"
          />
          <RoadmapAlertCard
            icon={<ScanFailIcon className="size-full" />}
            iconBgClassName="bg-[#fff3ec]"
            iconColorClassName="text-[#ea580c]"
            title="문서를 인식하지 못했어요"
            description="다시 촬영하거나 직접 체크해 주세요"
            actionLabel="직접 체크"
            actionClassName="bg-[#ea580c] text-white"
          />
          <RoadmapAlertCard
            icon={<CalendarErrorIcon className="size-full" />}
            iconBgClassName="bg-red-50"
            iconColorClassName="text-red-500"
            title="출국 예정일을 오늘 이후로 설정해 주세요"
          />
        </div>
      </Section>

      <Section title="NetworkErrorBanner" note="error/warning/notice">
        <div className="flex w-153.5 flex-col gap-3">
          <NetworkErrorBanner
            variant="error"
            icon={<WifiOffIcon className="size-full" />}
            message="인터넷 연결을 확인해 주세요"
            actionLabel="다시 시도"
          />
          <NetworkErrorBanner
            variant="error"
            icon={<ServerErrorIcon className="size-full" />}
            message="일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요"
            actionLabel="다시 시도"
          />
          <NetworkErrorBanner
            variant="warning"
            icon={<ClockDelayIcon className="size-full" />}
            message="응답이 지연되고 있어요. 다시 시도할까요?"
            actionLabel="다시 시도"
          />
          <NetworkErrorBanner
            variant="notice"
            icon={<GaugeIcon className="size-full" />}
            message="요청이 많아 잠시 후 이용 가능해요"
          />
        </div>
      </Section>

      <Section title="CityInsightCard (위시리스트 탭)">
        <CityInsightCard {...cityInsightCatalog[0]} isWished onToggleWish={() => {}} onCompare={() => {}} onReport={() => {}} />
      </Section>

      <Section title="RequiredDocumentCard (단독)" note="OCR 지원 서류는 '촬영하여 자동 체크' 버튼으로 시뮬레이션 확인 가능">
        <RequiredDocumentCardDemo />
      </Section>

      <Section title="CompareSelectionBar / CompareModal" note="비교함 2개 자동 담김, 화면 하단 고정 바 확인">
        <CompareDemo />
      </Section>

      <Section title="CityReportModal (AI 탐색 리포트)">
        <CityReportDemo />
      </Section>

      <Section title="로드맵 아이콘 전체" note={`${ROADMAP_ICONS.length}개`}>
        <div className="grid w-full grid-cols-8 gap-4">
          {ROADMAP_ICONS.map(({ name, Icon }) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-2 border border-gray-100 p-3">
              <Icon className="size-icon-lg text-gray-700" />
              <span className="label-02 text-center text-gray-500">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="LargeFillButton">
        <div className="w-90">
          <LargeFillButton label="다음으로" />
        </div>
      </Section>

      <Section title="PageNavigation">
        <PageNavigation currentPage={page} totalPages={5} onPageChange={setPage} />
      </Section>

      <Section title="스켈레톤" note="로드맵 상세 / 국가별 목록">
        <div className="flex w-full flex-col items-center gap-4">
          <RoadmapDetailSkeleton />
          <CountryRoadmapListSkeleton />
        </div>
      </Section>

      <Section title="Footer">
        <div className="w-full">
          <Footer />
        </div>
      </Section>
    </div>
  );
}

function DocumentTaskDetailModalDemo() {
  const [documents, setDocuments] = useState(apostilleRequiredDocuments);

  const handleCheck = (taskDocumentId: number) => {
    setDocuments((prev) => prev.map((d) => (d.taskDocumentId === taskDocumentId ? { ...d, isChecked: true } : d)));
  };

  return (
    <DocumentTaskDetailModal
      category="비자"
      title="아포스티유 공증"
      infoBanner="해외에서 한국 학력을 인정받기 위해 필요한 공증 절차입니다. 외교부 영사민원24를 통해 온라인으로 신청할 수 있습니다."
      documents={documents}
      dDayLabel="D-000"
      scheduledDate="2026.04.15"
      onCheck={handleCheck}
    />
  );
}

function RequiredDocumentCardDemo() {
  const [document, setDocument] = useState(apostilleRequiredDocuments[3]);

  return (
    <div className="w-100">
      <RequiredDocumentCard document={document} onOpenUpload={() => {}} onCheck={() => setDocument((d) => ({ ...d, isChecked: true }))} />
    </div>
  );
}

function CompareDemo() {
  const toggleCompare = useCompareStore((s) => s.toggleCompare);
  const openModal = useCompareStore((s) => s.openModal);
  const compareCities = cityInsightCatalog.slice(0, 3).map(toCompareCity);

  useEffect(() => {
    toggleCompare('berlin');
    toggleCompare('sydney');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <button type="button" onClick={openModal} className="title-02 w-fit rounded-2 bg-primary-500 px-4 py-2 text-white">
        비교 모달 열기
      </button>
      <CompareSelectionBar cities={compareCities} />
      <CompareModal cities={compareCities} />
    </div>
  );
}

function CityReportDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)} className="title-02 rounded-2 bg-primary-500 px-4 py-2 text-white">
        AI 리포트 모달 열기
      </button>
      {isOpen && (
        <CityReportModal isOpen onClose={() => setIsOpen(false)} data={berlinReportData} onSearch={mockSearchResult} />
      )}
    </div>
  );
}
