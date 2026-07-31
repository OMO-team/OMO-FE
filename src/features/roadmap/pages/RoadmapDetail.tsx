import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import CityHeroBanner from '../components/CityHeroBanner';
import RoadmapHeader from '../components/RoadmapHeader';
import RoadmapTimeline from '../components/RoadmapTimeline';
import BudgetPlanCard from '../components/BudgetPlanCard';
import AiReportCard from '../components/AiReportCard';
import DatePickerModal from '../components/DatePickerModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import RoadmapAlertCard from '../components/RoadmapAlertCard';
import BagIcon from '../components/icons/BagIcon';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import { roadmapDetailByCityId, apostilleRequiredDocuments } from '../mocks/mockData';
import { useRoadmapStore } from '../store/useRoadmapStore';
import type { UploadedFileItem, RequiredDocumentData } from '../types/roadmap';

/** task-detail 자식 라우트(TaskDetailRoute)에 useOutletContext로 전달되는 값 */
export type TaskDetailContext = {
  documents: RequiredDocumentData[];
  onCheck: (taskDocumentId: number) => void;
  onOpenUpload: (taskDocumentId: number) => void;
  onDateClick: () => void;
};

function parseDepartureDate(value: string | null) {
  const match = value?.match(/(\d+)년\s*(\d+)월\s*(\d+)일/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

type RoadmapDetailProps = {
  /** URL의 :cityId로부터 전달 — 로드맵 목록에 없는 값이면 "찾을 수 없음" 상태를 보여줌 */
  cityId?: string;
  onBack?: () => void;
};

export default function RoadmapDetail({ cityId, onBack }: RoadmapDetailProps) {
  const navigate = useNavigate();
  const countryGroups = useRoadmapStore((s) => s.countryGroups);
  const allCities = countryGroups.flatMap((group) => group.cities);
  const city = allCities.find((c) => c.cityId === cityId);
  const roadmapDetail = city ? roadmapDetailByCityId[city.cityId] : undefined;

  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4);
  const [months, setMonths] = useState(roadmapDetail?.budgetPlan.months ?? 12);
  const [departureDate, setDepartureDate] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [datePickerTarget, setDatePickerTarget] = useState<'departure' | 'start' | 'task' | null>(null);
  const [datePickerMode, setDatePickerMode] = useState<'day' | 'month'>('day');
  const [datePickerViewYear, setDatePickerViewYear] = useState(2026);
  const [datePickerViewMonth, setDatePickerViewMonth] = useState(4);
  const [documents, setDocuments] = useState(apostilleRequiredDocuments);
  const [uploadTargetDocumentId, setUploadTargetDocumentId] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);

  if (!city) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-20 px-4">
        <RoadmapAlertCard
          icon={<BagIcon className="size-full" />}
          title="도시를 찾을 수 없습니다"
          description="요청하신 도시의 로드맵 정보가 존재하지 않습니다"
          actionLabel={onBack ? '목록으로 돌아가기' : undefined}
          onAction={onBack}
        />
      </div>
    );
  }

  const handleCheckDocument = (taskDocumentId: number) => {
    setDocuments((prev) => prev.map((d) => (d.taskDocumentId === taskDocumentId ? { ...d, isChecked: true } : d)));
  };

  const handleSelectFiles = (fileList: FileList) => {
    const newItems: UploadedFileItem[] = Array.from(fileList).map((file) => ({
      name: file.name,
      uploadedSizeMB: 0,
      totalSizeMB: Math.max(1, Math.round(file.size / 1024 / 1024)),
      status: 'uploading',
    }));
    setUploadedFiles((prev) => [...prev, ...newItems]);
    newItems.forEach((item) => {
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.name === item.name ? { ...f, uploadedSizeMB: f.totalSizeMB, status: 'processing' } : f)),
        );
      }, 1500);
      setTimeout(() => {
        setUploadedFiles((prev) => prev.map((f) => (f.name === item.name ? { ...f, status: 'completed' } : f)));
      }, 3000);
    });
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const handleNextMonth = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const parsedDeparture = parseDepartureDate(departureDate);
  const parsedStart = parseDepartureDate(startDate);

  const taskDetailContext: TaskDetailContext = {
    documents,
    onCheck: handleCheckDocument,
    onOpenUpload: (taskDocumentId) => {
      setUploadedFiles([]);
      setUploadTargetDocumentId(taskDocumentId);
    },
    onDateClick: () => {
      setDatePickerMode('day');
      setDatePickerTarget('task');
    },
  };

  if (!roadmapDetail) {
    return (
      <div className="flex min-h-screen flex-col bg-gray-20">
        <div className="relative">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="body-02 absolute left-6 top-24 z-10 rounded-2 bg-black/30 px-4 py-2 text-white"
            >
              〈 목록으로
            </button>
          )}
          <CityHeroBanner cityName={city.cityName} progressPercent={city.progressPercent} imageUrl={city.imageUrl} />
        </div>
        <div className="mx-auto flex w-full max-w-content flex-1 items-center justify-center px-4 py-20">
          <RoadmapAlertCard
            icon={<BagIcon className="size-full" />}
            title="아직 준비된 로드맵 데이터가 없습니다"
            description={`${city.cityName}의 로드맵 정보를 준비 중이에요`}
          />
        </div>
      </div>
    );
  }

  const { tasks, budgetPlan, aiReport } = roadmapDetail;

  return (
    <div className="flex min-h-screen flex-col bg-gray-20">
      <div className="relative">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="body-02 absolute left-6 top-24 z-10 rounded-2 bg-black/30 px-4 py-2 text-white"
          >
            〈 목록으로
          </button>
        )}
        <CityHeroBanner cityName={city.cityName} progressPercent={city.progressPercent} imageUrl={city.imageUrl} />
      </div>

      <div className="mx-auto flex w-full max-w-content gap-[30px] px-4 py-10">
        <div className="relative flex flex-col gap-5">
          <RoadmapHeader
            year={year}
            month={month}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            startDate={startDate ?? undefined}
            onStartDateClick={() => {
              setDatePickerViewYear(parsedStart?.year ?? year);
              setDatePickerViewMonth(parsedStart?.month ?? month);
              setDatePickerMode('day');
              setDatePickerTarget('start');
            }}
            departureDate={departureDate ?? undefined}
            onDepartureDateClick={() => {
              setDatePickerViewYear(parsedDeparture?.year ?? year);
              setDatePickerViewMonth(parsedDeparture?.month ?? month);
              setDatePickerMode('day');
              setDatePickerTarget('departure');
            }}
          />
          <RoadmapTimeline
            tasks={tasks}
            onTaskClick={(index) => navigate(`task-detail/${index}`, { preventScrollReset: true })}
          />

          {datePickerTarget === 'start' && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDatePickerTarget(null)} />
              <div className="absolute left-0 top-30 z-50">
                <DatePickerModal
                  mode={datePickerMode}
                  year={datePickerViewYear}
                  month={datePickerViewMonth}
                  selectedDay={
                    parsedStart?.year === datePickerViewYear && parsedStart?.month === datePickerViewMonth
                      ? parsedStart.day
                      : undefined
                  }
                  selectedMonth={datePickerViewMonth}
                  onClose={() => setDatePickerTarget(null)}
                  onModeToggle={() => setDatePickerMode((m) => (m === 'day' ? 'month' : 'day'))}
                  onSelectMonth={(m) => {
                    setDatePickerViewMonth(m);
                    setDatePickerMode('day');
                  }}
                  onYearPrev={() => setDatePickerViewYear((y) => y - 1)}
                  onYearNext={() => setDatePickerViewYear((y) => y + 1)}
                  onSelectDay={(day) => {
                    setStartDate(
                      `${datePickerViewYear}년 ${String(datePickerViewMonth).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일`,
                    );
                    setDatePickerTarget(null);
                  }}
                />
              </div>
            </>
          )}

          {datePickerTarget === 'departure' && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDatePickerTarget(null)} />
              <div className="absolute right-0 top-30 z-50">
                <DatePickerModal
                  mode={datePickerMode}
                  year={datePickerViewYear}
                  month={datePickerViewMonth}
                  selectedDay={
                    parsedDeparture?.year === datePickerViewYear && parsedDeparture?.month === datePickerViewMonth
                      ? parsedDeparture.day
                      : undefined
                  }
                  selectedMonth={datePickerViewMonth}
                  onClose={() => setDatePickerTarget(null)}
                  onModeToggle={() => setDatePickerMode((m) => (m === 'day' ? 'month' : 'day'))}
                  onSelectMonth={(m) => {
                    setDatePickerViewMonth(m);
                    setDatePickerMode('day');
                  }}
                  onYearPrev={() => setDatePickerViewYear((y) => y - 1)}
                  onYearNext={() => setDatePickerViewYear((y) => y + 1)}
                  onSelectDay={(day) => {
                    setDepartureDate(
                      `${datePickerViewYear}년 ${String(datePickerViewMonth).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일`,
                    );
                    setDatePickerTarget(null);
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-[30px]">
          <BudgetPlanCard
            months={months}
            onMonthsChange={setMonths}
            initialSettlementCost={budgetPlan.initialSettlementCost}
            monthlyLivingCost={budgetPlan.monthlyLivingCost}
            stayMonths={budgetPlan.stayMonths}
            livingCostSubtotal={budgetPlan.livingCostSubtotal}
            totalBudget={budgetPlan.totalBudget}
          />
          <AiReportCard
            score={aiReport.score}
            cityName={aiReport.cityName}
            summary={aiReport.summary}
          />
        </div>
      </div>

      <Outlet context={taskDetailContext} />

      {uploadTargetDocumentId !== null && (
        <ModalOverlay zIndex={60} onClose={() => setUploadTargetDocumentId(null)}>
          <DocumentUploadModal
            files={uploadedFiles}
            onSelectFiles={handleSelectFiles}
            onRemoveFile={(name) => setUploadedFiles((prev) => prev.filter((f) => f.name !== name))}
            onComplete={() => {
              handleCheckDocument(uploadTargetDocumentId);
              setUploadTargetDocumentId(null);
            }}
            onClose={() => setUploadTargetDocumentId(null)}
          />
        </ModalOverlay>
      )}

      {datePickerTarget === 'task' && (
        <ModalOverlay zIndex={60} onClose={() => setDatePickerTarget(null)}>
          <DatePickerModal
            mode={datePickerMode}
            year={year}
            month={month}
            selectedDay={15}
            selectedMonth={month}
            onClose={() => setDatePickerTarget(null)}
            onModeToggle={() => setDatePickerMode((m) => (m === 'day' ? 'month' : 'day'))}
            onSelectMonth={(m) => {
              setMonth(m);
              setDatePickerMode('day');
            }}
            onYearPrev={() => setYear((y) => y - 1)}
            onYearNext={() => setYear((y) => y + 1)}
            onSelectDay={() => setDatePickerTarget(null)}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
