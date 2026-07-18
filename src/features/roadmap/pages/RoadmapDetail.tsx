import { useState } from 'react';
import Header from '../../../shared/components/Header';
import CityHeroBanner from '../components/CityHeroBanner';
import RoadmapHeader from '../components/RoadmapHeader';
import RoadmapTimeline from '../components/RoadmapTimeline';
import BudgetPlanCard from '../components/BudgetPlanCard';
import AiReportCard from '../components/AiReportCard';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import DatePickerModal from '../components/DatePickerModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import Footer from '../../../shared/components/Footer';
import {
  berlinRoadmapTasks,
  berlinBudgetPlan,
  berlinAiReport,
  apostilleRequiredDocuments,
  countryRoadmapGroups,
} from '../mocks/mockData';
import type { CityRoadmapData, UploadedFileItem } from '../types/roadmap';

const APOSTILLE_INFO_BANNER =
  '해외에서 한국 학력을 인정받기 위해 필요한 공증 절차입니다. 외교부 영사민원24를 통해 온라인으로 신청할 수 있습니다.';

const DEFAULT_CITY = countryRoadmapGroups[0].cities[0];

function parseDepartureDate(value: string | null) {
  const match = value?.match(/(\d+)년\s*(\d+)월\s*(\d+)일/);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

type RoadmapDetailProps = {
  city?: CityRoadmapData;
  onBack?: () => void;
};

export default function RoadmapDetail({ city = DEFAULT_CITY, onBack }: RoadmapDetailProps) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4);
  const [months, setMonths] = useState(berlinBudgetPlan.months);
  const [openTaskIndex, setOpenTaskIndex] = useState<number | null>(null);
  const [departureDate, setDepartureDate] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [datePickerTarget, setDatePickerTarget] = useState<'departure' | 'start' | 'task' | null>(null);
  const [datePickerMode, setDatePickerMode] = useState<'day' | 'month'>('day');
  const [datePickerViewYear, setDatePickerViewYear] = useState(2026);
  const [datePickerViewMonth, setDatePickerViewMonth] = useState(4);
  const [uploadTargetDocument, setUploadTargetDocument] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);

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

  const openTask = openTaskIndex !== null ? berlinRoadmapTasks[openTaskIndex] : null;
  const parsedDeparture = parseDepartureDate(departureDate);
  const parsedStart = parseDepartureDate(startDate);

  return (
    <div className="flex min-h-screen flex-col bg-gray-20">
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-10">
          <Header isLoggedIn={false} variant="overlay" />
        </div>
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
          <RoadmapTimeline tasks={berlinRoadmapTasks} onTaskClick={setOpenTaskIndex} />

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
            initialSettlementCost={berlinBudgetPlan.initialSettlementCost}
            monthlyLivingCost={berlinBudgetPlan.monthlyLivingCost}
            stayMonths={berlinBudgetPlan.stayMonths}
            livingCostSubtotal={berlinBudgetPlan.livingCostSubtotal}
            totalBudget={berlinBudgetPlan.totalBudget}
          />
          <AiReportCard
            score={berlinAiReport.score}
            cityName={berlinAiReport.cityName}
            summary={berlinAiReport.summary}
          />
        </div>
      </div>

      <Footer />

      {openTask && (
        <ModalOverlay onClose={() => setOpenTaskIndex(null)}>
          <DocumentTaskDetailModal
            category={openTask.category}
            title={openTask.title}
            infoBanner={APOSTILLE_INFO_BANNER}
            completedCount={2}
            totalCount={4}
            dDayLabel={openTask.dDay ? `D-${openTask.dDay}` : undefined}
            scheduledDate={openTask.date}
            onDateClick={() => {
              setDatePickerMode('day');
              setDatePickerTarget('task');
            }}
            onClose={() => setOpenTaskIndex(null)}
            documents={apostilleRequiredDocuments}
            locked={openTask.status === 'lock'}
            onOpenUpload={(name) => {
              setUploadedFiles([]);
              setUploadTargetDocument(name);
            }}
          />
        </ModalOverlay>
      )}

      {uploadTargetDocument && (
        <ModalOverlay zIndex={60} onClose={() => setUploadTargetDocument(null)}>
          <DocumentUploadModal
            files={uploadedFiles}
            onSelectFiles={handleSelectFiles}
            onRemoveFile={(name) => setUploadedFiles((prev) => prev.filter((f) => f.name !== name))}
            onComplete={() => setUploadTargetDocument(null)}
            onClose={() => setUploadTargetDocument(null)}
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
