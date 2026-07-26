import { useState, type ComponentType } from 'react';
import CityRoadmapCard from '../components/CityRoadmapCard';
import RequiredDocumentCard from '../components/RequiredDocumentCard';
import TimeLineTaskCard from '../components/TimeLineTaskCard';
import BudgetPlanCard from '../components/BudgetPlanCard';
import CityHeroBanner from '../components/CityHeroBanner';
import RoadmapHeader from '../components/RoadmapHeader';
import RoadmapMonthSelector from '../components/RoadmapMonthSelector';
import RoadmapTimeline from '../components/RoadmapTimeline';
import StayDurationPicker from '../components/StayDurationPicker';
import DatePickerModal from '../components/DatePickerModal';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import EmptyStateIcon from '../components/icons/EmptyStateIcon';
import RoadmapAlertCard from '../components/RoadmapAlertCard';
import AiReportCard from '../components/AiReportCard';
import RoadmapRemovedToast from '../components/RoadmapRemovedToast';
import DeleteRoadmapModal from '../components/DeleteRoadmapModal';
import CountryGroupHeader from '../components/CountryGroupHeader';
import LockOutlineIcon from '../components/icons/LockOutlineIcon';
import ScanFailIcon from '../components/icons/ScanFailIcon';
import CalendarErrorIcon from '../components/icons/CalendarErrorIcon';
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
import {
  berlinRoadmapTasks,
  berlinBudgetPlan,
  berlinAiReport,
  apostilleRequiredDocuments,
  countryRoadmapGroups,
  documentUploadFiles,
} from '../mocks/mockData';

function Section({
  title,
  path,
  note,
  children,
}: {
  title: string;
  path: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full max-w-350 flex-col gap-4 border-t border-gray-200 pt-8">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-baseline gap-3">
          <h2 className="heading-06 text-gray-900">{title}</h2>
          {note && <span className="body-04 text-gray-400">{note}</span>}
        </div>
        <code className="label-02 text-gray-400">{path}</code>
      </div>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  );
}

const ICONS_PATH = 'src/features/roadmap/components/icons/';

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
  const [stayMonths, setStayMonths] = useState(6);
  const [isCountryExpanded, setIsCountryExpanded] = useState(true);
  const cityCard = countryRoadmapGroups[0].cities[0];

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-gray-50 p-10">
      <h1 className="heading-04 text-gray-900">roadmap/components 전체 카탈로그</h1>

      <Section title="CityRoadmapCard" path="src/features/roadmap/components/CityRoadmapCard.tsx">
        <CityRoadmapCard {...cityCard} />
      </Section>

      <Section title="CountryGroupHeader" path="src/features/roadmap/components/CountryGroupHeader.tsx" note="expanded/collapsed 클릭으로 전환">
        <div className="flex w-100 flex-col gap-2">
          <CountryGroupHeader
            countryName="독일"
            cityCount={3}
            isExpanded={isCountryExpanded}
            onToggle={() => setIsCountryExpanded((v) => !v)}
          />
        </div>
      </Section>

      <Section title="CityHeroBanner" path="src/features/roadmap/components/CityHeroBanner.tsx">
        <CityHeroBanner cityName="베를린" progressPercent={43} imageUrl={cityCard.imageUrl} />
      </Section>

      <Section title="RoadmapHeader" path="src/features/roadmap/components/RoadmapHeader.tsx">
        <RoadmapHeader year={2026} month={4} departureDate="2026년 06월 21일" />
      </Section>

      <Section title="RoadmapMonthSelector" path="src/features/roadmap/components/RoadmapMonthSelector.tsx">
        <RoadmapMonthSelector year={2026} month={4} />
      </Section>

      <Section title="TimeLineTaskCard" path="src/features/roadmap/components/TimeLineTaskCard.tsx" note="status: success/ongoing/upcoming/lock/missed">
        <div className="flex flex-col gap-2">
          {berlinRoadmapTasks.map((task, i) => <TimeLineTaskCard key={`${task.title}-${i}`} {...task} />)}
        </div>
      </Section>

      <Section title="RoadmapTimeline" path="src/features/roadmap/components/RoadmapTimeline.tsx">
        <RoadmapTimeline tasks={berlinRoadmapTasks} />
      </Section>

      <Section title="BudgetPlanCard" path="src/features/roadmap/components/BudgetPlanCard.tsx">
        <BudgetPlanCard {...berlinBudgetPlan} months={months} onMonthsChange={setMonths} />
      </Section>

      <Section title="StayDurationPicker" path="src/features/roadmap/components/StayDurationPicker.tsx">
        <div className="w-90">
          <StayDurationPicker months={stayMonths} onChange={setStayMonths} />
        </div>
      </Section>

      <Section title="AiReportCard" path="src/features/roadmap/components/AiReportCard.tsx">
        <AiReportCard {...berlinAiReport} />
      </Section>

      <Section title="RequiredDocumentCard" path="src/features/roadmap/components/RequiredDocumentCard.tsx" note="OCR 지원 서류는 '촬영하여 자동 체크' 버튼 클릭해서 시뮬레이션 확인 가능">
        <RequiredDocumentCardDemo />
      </Section>

      <Section title="DocumentTaskDetailModal" path="src/features/roadmap/components/DocumentTaskDetailModal.tsx">
        <DocumentTaskDetailModalDemo />
      </Section>

      <Section title="DocumentUploadModal" path="src/features/roadmap/components/DocumentUploadModal.tsx" note="uploading/completed/error 상태 동시 표시">
        <DocumentUploadModal files={documentUploadFiles} maxSizeMB={10} />
      </Section>

      <Section title="DatePickerModal" path="src/features/roadmap/components/DatePickerModal.tsx" note="mode: day / month · warningMessage 있으면 상단에 경고 pill 표시">
        <DatePickerModal mode="day" year={2026} month={4} selectedDay={15} />
        <DatePickerModal mode="month" year={2026} month={4} selectedMonth={4} />
        <DatePickerModal mode="day" year={2026} month={4} selectedDay={15} warningMessage="출국 예정일은 오늘 이후 날짜로 선택해 주세요." />
      </Section>

      <Section title="DeleteRoadmapModal" path="src/features/roadmap/components/DeleteRoadmapModal.tsx">
        <DeleteRoadmapModal cityName="베를린" />
      </Section>

      <Section title="RoadmapRemovedToast" path="src/features/roadmap/components/RoadmapRemovedToast.tsx" note="화면 상단 고정(fixed) 토스트라 여기서는 상대 위치로 감싸서 표시">
        <div className="relative flex h-16 w-full justify-center">
          <RoadmapRemovedToast cityName="베를린" />
        </div>
      </Section>

      <Section title="EmptyStateIcon" path="src/features/roadmap/components/icons/EmptyStateIcon.tsx">
        <EmptyStateIcon />
      </Section>

      <Section title="RoadmapAlertCard" path="src/features/roadmap/components/RoadmapAlertCard.tsx" note="에러/경고 카드 3종">
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

      <Section title="아이콘 전체" path={ICONS_PATH} note={`${ROADMAP_ICONS.length}개`}>
        <div className="grid w-full grid-cols-8 gap-4">
          {ROADMAP_ICONS.map(({ name, Icon }) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-2 border border-gray-100 p-3">
              <Icon className="size-icon-lg text-gray-700" />
              <span className="label-02 text-center text-gray-500">{name}</span>
            </div>
          ))}
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
