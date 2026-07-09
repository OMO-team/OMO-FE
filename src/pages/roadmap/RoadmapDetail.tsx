import { useState } from 'react';
import Header from '../../components/common/Header';
import CityHeroBanner from '../../components/roadmap/CityHeroBanner';
import RoadmapHeader from '../../components/roadmap/RoadmapHeader';
import RoadmapTimeline from '../../components/roadmap/RoadmapTimeline';
import BudgetPlanCard from '../../components/roadmap/BudgetPlanCard';
import AiReportCard from '../../components/roadmap/AiReportCard';
import DocumentTaskDetailModal from '../../components/roadmap/DocumentTaskDetailModal';
import DatePickerModal from '../../components/roadmap/DatePickerModal';
import ModalOverlay from '../../components/common/ModalOverlay';
import Footer from '../../components/common/Footer';
import {
  berlinRoadmapTasks,
  berlinBudgetPlan,
  berlinAiReport,
  apostilleRequiredDocuments,
  countryRoadmapGroups,
} from '../../components/roadmap/mockData';
import type { CityRoadmapData } from '../../components/types/roadmap';

const APOSTILLE_INFO_BANNER =
  '해외에서 한국 학력을 인정받기 위해 필요한 공증 절차입니다. 외교부 영사민원24를 통해 온라인으로 신청할 수 있습니다.';

const DEFAULT_CITY = countryRoadmapGroups[0].cities[0];

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
  const [datePickerTarget, setDatePickerTarget] = useState<'departure' | 'task' | null>(null);

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

  return (
    <div className="flex max-h-[90vh] w-[90vw] max-w-content flex-col overflow-y-auto rounded-5 bg-gray-20">
      <Header />

      <div className="relative">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="body-02 absolute left-6 top-6 z-10 rounded-2 bg-black/30 px-4 py-2 text-white"
          >
            〈 목록으로
          </button>
        )}
        <CityHeroBanner cityName={city.cityName} progressPercent={city.progressPercent} imageUrl={city.imageUrl} />
      </div>

      <div className="mx-auto flex w-full max-w-content gap-[30px] px-4 py-10">
        <div className="flex flex-col gap-5">
          <RoadmapHeader
            year={year}
            month={month}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            departureDate={departureDate ?? undefined}
            onDepartureDateClick={() => setDatePickerTarget('departure')}
          />
          <RoadmapTimeline tasks={berlinRoadmapTasks} onTaskClick={setOpenTaskIndex} />
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
            totalCount={3}
            dDayLabel={openTask.dDay ? `D-${openTask.dDay}` : undefined}
            scheduledDate={openTask.date}
            onDateClick={() => setDatePickerTarget('task')}
            onClose={() => setOpenTaskIndex(null)}
            documents={apostilleRequiredDocuments}
            locked={openTask.status === 'lock'}
          />
        </ModalOverlay>
      )}

      {datePickerTarget && (
        <ModalOverlay zIndex={60} onClose={() => setDatePickerTarget(null)}>
          <DatePickerModal
            mode="day"
            year={year}
            month={month}
            selectedDay={15}
            onClose={() => setDatePickerTarget(null)}
            onSelectDay={(day) => {
              if (datePickerTarget === 'departure') {
                setDepartureDate(`${year}년 ${String(month).padStart(2, '0')}월 ${String(day).padStart(2, '0')}일`);
              }
              setDatePickerTarget(null);
            }}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
