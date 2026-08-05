import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import CityHeroBanner from '../components/CityHeroBanner';
import RoadmapHeader from '../components/RoadmapHeader';
import RoadmapTimeline from '../components/RoadmapTimeline';
import BudgetPlanCard from '../components/BudgetPlanCard';
import AiReportCard from '../components/AiReportCard';
import DatePickerModal from '../components/DatePickerModal';
import RoadmapAlertCard from '../components/RoadmapAlertCard';
import RoadmapDetailSkeleton from './RoadmapDetailSkeleton';
import BagIcon from '../components/icons/BagIcon';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import CityReportModal from '../../city-ai-report/components/CityReportModal';
import { mockSearchResult } from '../../city-ai-report/mocks/mockData';
import { roadmapsApi } from '../api/roadmapsApi';
import { toRoadmapTaskData, formatDotDate } from '../utils/roadmapDetailAdapter';
import { buildCityReportData } from '../utils/buildCityReportData';
import type { RoadmapDetail as RoadmapDetailResult } from '../types/api';
import type { CityInsightData } from '../types/cityInsight';

/** task-detail 자식 라우트(TaskDetailRoute)에 useOutletContext로 전달되는 값 */
export type TaskDetailContext = {
  onDateClick: () => void;
};

function parseDotDate(value?: string) {
  if (!value) return null;
  const [year, month, day] = value.split('.').map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

type RoadmapDetailProps = {
  /** URL의 :roadmapId로부터 전달 — 존재하지 않는 값이면 "찾을 수 없음" 상태를 보여줌 */
  roadmapId: number;
  onBack?: () => void;
};

export default function RoadmapDetail({ roadmapId, onBack }: RoadmapDetailProps) {
  const navigate = useNavigate();
  const [detail, setDetail] = useState<RoadmapDetailResult | null | undefined>(undefined);
  const [months, setMonths] = useState(1);
  /** 준비 시작일은 아직 백엔드 스펙에 없는 필드라 화면에서만 임시로 관리 (서버 미반영) */
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [datePickerTarget, setDatePickerTarget] = useState<'departure' | 'start' | 'task' | null>(null);
  const [datePickerMode, setDatePickerMode] = useState<'day' | 'month'>('day');
  const [datePickerViewYear, setDatePickerViewYear] = useState(new Date().getFullYear());
  const [datePickerViewMonth, setDatePickerViewMonth] = useState(new Date().getMonth() + 1);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const isValidRoadmapId = Number.isFinite(roadmapId);

  useEffect(() => {
    if (!isValidRoadmapId) return;
    roadmapsApi
      .get(roadmapId)
      .then((result) => {
        setDetail(result);
        if (result) setMonths(result.stayMonths ?? 1);
      })
      .catch((error) => {
        console.error('로드맵 상세 조회 실패', error);
        setDetail(null);
      });
  }, [roadmapId, isValidRoadmapId]);

  if (isValidRoadmapId && detail === undefined) {
    return <RoadmapDetailSkeleton />;
  }

  if (!isValidRoadmapId || !detail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-20 px-4">
        <RoadmapAlertCard
          icon={<BagIcon className="size-full" />}
          title="로드맵을 찾을 수 없습니다"
          description="요청하신 로드맵 정보가 존재하지 않습니다"
          actionLabel={onBack ? '목록으로 돌아가기' : undefined}
          onAction={onBack}
        />
      </div>
    );
  }

  const refreshDetail = async () => {
    const refreshed = await roadmapsApi.get(roadmapId);
    setDetail(refreshed);
    if (refreshed) setMonths(refreshed.stayMonths ?? 1);
  };

  const handleMonthsChange = async (newMonths: number) => {
    setMonths(newMonths);
    try {
      await roadmapsApi.updateBudget(roadmapId, { stayMonths: newMonths });
      await refreshDetail();
    } catch (error) {
      console.error('예산 계획 변경 실패', error);
    }
  };

  const handleSelectDeparture = async (day: number) => {
    setDatePickerTarget(null);
    const iso = `${datePickerViewYear}-${String(datePickerViewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    try {
      await roadmapsApi.updateSchedule(roadmapId, { departureDate: iso });
      await refreshDetail();
    } catch (error) {
      console.error('출국일 변경 실패', error);
    }
  };

  const departureDate = formatDotDate(detail.departureDate);
  const parsedDeparture = parseDotDate(departureDate);
  const parsedStart = parseDotDate(startDate);

  const taskDetailContext: TaskDetailContext = {
    onDateClick: () => {
      setDatePickerViewYear(new Date().getFullYear());
      setDatePickerViewMonth(new Date().getMonth() + 1);
      setDatePickerMode('day');
      setDatePickerTarget('task');
    },
  };

  const budget = detail.budget;
  const livingCostSubtotal = (budget?.monthlyCost ?? 0) * months;
  const totalBudget = budget?.totalCost ?? (budget?.initialSettlementCost ?? 0) + livingCostSubtotal;

  /** AI 탐색 리포트는 city-ai-report 도메인 데이터라 로드맵 API에는 없음 — 준비된 값만 채우고 나머지는 준비중으로 표시 */
  const reportCityData: CityInsightData = {
    cityId: String(detail.cityId),
    cityName: detail.cityName,
    countryName: detail.countryName,
    imageUrl: detail.cityImageUrl,
    description: '준비중',
    rating: 0,
    monthlyCost: '준비중',
    costPercent: 0,
    accommodationPercent: 0,
    accommodationLabel: '준비중',
    visaPercent: 0,
    visaLabel: '준비중',
    securityScore: 0,
    languageScore: 0,
    infrastructureScore: 0,
  };

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
        <CityHeroBanner cityName={detail.cityName} progressPercent={detail.progressRate} imageUrl={detail.cityImageUrl} />
      </div>

      <div className="mx-auto flex w-full max-w-content gap-7.5 px-4 py-10">
        <div className="relative flex flex-col gap-5">
          <RoadmapHeader
            year={datePickerViewYear}
            month={datePickerViewMonth}
            onPrevMonth={() => {
              setDatePickerViewMonth((m) => (m === 1 ? 12 : m - 1));
              if (datePickerViewMonth === 1) setDatePickerViewYear((y) => y - 1);
            }}
            onNextMonth={() => {
              setDatePickerViewMonth((m) => (m === 12 ? 1 : m + 1));
              if (datePickerViewMonth === 12) setDatePickerViewYear((y) => y + 1);
            }}
            startDate={startDate}
            onStartDateClick={() => {
              setDatePickerViewYear(parsedStart?.year ?? datePickerViewYear);
              setDatePickerViewMonth(parsedStart?.month ?? datePickerViewMonth);
              setDatePickerMode('day');
              setDatePickerTarget('start');
            }}
            departureDate={departureDate}
            onDepartureDateClick={() => {
              setDatePickerViewYear(parsedDeparture?.year ?? datePickerViewYear);
              setDatePickerViewMonth(parsedDeparture?.month ?? datePickerViewMonth);
              setDatePickerMode('day');
              setDatePickerTarget('departure');
            }}
          />
          <RoadmapTimeline
            tasks={detail.tasks.map(toRoadmapTaskData)}
            onTaskClick={(index) => {
              const taskId = detail.tasks[index]?.taskId;
              if (taskId != null) navigate(`task-detail/${taskId}`, { preventScrollReset: true });
            }}
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
                      `${datePickerViewYear}.${String(datePickerViewMonth).padStart(2, '0')}.${String(day).padStart(2, '0')}`,
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
                  onSelectDay={handleSelectDeparture}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-7.5">
          <BudgetPlanCard
            months={months}
            onMonthsChange={handleMonthsChange}
            initialSettlementCost={budget?.initialSettlementCost ?? 0}
            monthlyLivingCost={budget?.monthlyCost ?? 0}
            stayMonths={months}
            livingCostSubtotal={livingCostSubtotal}
            totalBudget={totalBudget}
          />
          <AiReportCard
            score={0}
            cityName={detail.cityName}
            summary="준비중"
            onViewReport={() => setIsReportOpen(true)}
          />
        </div>
      </div>

      <Outlet context={taskDetailContext} />

      {datePickerTarget === 'task' && (
        <ModalOverlay zIndex={60} onClose={() => setDatePickerTarget(null)}>
          <DatePickerModal
            mode={datePickerMode}
            year={datePickerViewYear}
            month={datePickerViewMonth}
            selectedMonth={datePickerViewMonth}
            onClose={() => setDatePickerTarget(null)}
            onModeToggle={() => setDatePickerMode((m) => (m === 'day' ? 'month' : 'day'))}
            onSelectMonth={(m) => {
              setDatePickerViewMonth(m);
              setDatePickerMode('day');
            }}
            onYearPrev={() => setDatePickerViewYear((y) => y - 1)}
            onYearNext={() => setDatePickerViewYear((y) => y + 1)}
            onSelectDay={() => setDatePickerTarget(null)}
          />
        </ModalOverlay>
      )}

      {isReportOpen && (
        <CityReportModal
          isOpen
          onClose={() => setIsReportOpen(false)}
          data={buildCityReportData(reportCityData)}
          onSearch={mockSearchResult}
        />
      )}
    </div>
  );
}
