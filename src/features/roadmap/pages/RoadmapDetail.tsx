import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import CityHeroBanner from '../components/CityHeroBanner';
import RoadmapHeader from '../components/RoadmapHeader';
import RoadmapTimeline from '../components/RoadmapTimeline';
import BudgetPlanCard from '../components/BudgetPlanCard';
import AiReportCard from '../components/AiReportCard';
import DatePickerModal from '../components/DatePickerModal';
import RoadmapAlertCard from '../components/RoadmapAlertCard';
import RoadmapDetailSkeleton from './RoadmapDetailSkeleton';
import BagIcon from '../components/icons/BagIcon';
import CityReportModal from '../../city-ai-report/components/CityReportModal';
import { cityAiReportApi } from '../../city-ai-report/api/cityAiReportApi';
import { roadmapsApi } from '../api/roadmapsApi';
import { citiesApi } from '../api/citiesApi';
import { tasksApi } from '../api/tasksApi';
import { cityQueryKeys, roadmapQueryKeys, taskQueryKeys } from '../api/queryKeys';
import { toRoadmapTaskData, formatDotDate, getToday } from '../utils/roadmapDetailAdapter';
import { toCityInsightData } from '../utils/wishlistAdapter';
import { buildCityReportData } from '../utils/buildCityReportData';
import { CITY_INFO_KO } from '../mocks/cityCountryMap';
import type { RoadmapDetail as RoadmapDetailResult } from '../types/api';
import type { CityInsightData } from '../types/cityInsight';

/** 도시 정보는 거의 바뀌지 않아서 한 번 받아두고 화면 간에 재사용 */
const CITY_CATALOG_STALE_TIME = 1000 * 60 * 60;

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
  const queryClient = useQueryClient();
  /** 준비 시작일은 아직 백엔드 스펙에 없는 필드라 화면에서만 임시로 관리 (서버 미반영) */
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [datePickerTarget, setDatePickerTarget] = useState<'departure' | 'start' | null>(null);
  const [datePickerMode, setDatePickerMode] = useState<'day' | 'month'>('day');
  const [datePickerViewYear, setDatePickerViewYear] = useState(new Date().getFullYear());
  const [datePickerViewMonth, setDatePickerViewMonth] = useState(new Date().getMonth() + 1);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const isValidRoadmapId = Number.isFinite(roadmapId);

  const {
    data: detail,
    isPending,
    isError,
  } = useQuery({
    queryKey: roadmapQueryKeys.detail(roadmapId),
    queryFn: () => roadmapsApi.get(roadmapId),
    enabled: isValidRoadmapId,
  });

  /**
   * 로드맵 API에는 도시의 평점·요약·지표가 없어서 AI 리포트를 채울 수 없음.
   * 단일 도시 조회 엔드포인트가 없어 카탈로그 전체를 받아 해당 도시를 찾아 쓴다.
   * 리포트 모달뿐 아니라 화면에 항상 보이는 AI 리포트 카드의 총점·요약도 여기서 나오므로
   * 모달을 열 때까지 미루지 않고 처음부터 받아온다(캐시는 다른 화면과 공유).
   */
  const { data: cityCatalog } = useQuery({
    queryKey: cityQueryKeys.list,
    queryFn: citiesApi.list,
    staleTime: CITY_CATALOG_STALE_TIME,
  });

  /**
   * 타임라인 카드의 "3/4 완료"에 쓸 서류 완료 개수.
   * 로드맵 상세 응답에는 totalDocumentCount만 있어서, 서류가 있는 태스크만 상세를 따로 받아 채운다.
   * 태스크 상세는 모달에서도 같은 키로 쓰기 때문에 캐시가 공유된다.
   */
  const documentTaskIds = (detail?.tasks ?? []).filter((task) => task.totalDocumentCount > 0).map((task) => task.taskId);
  const taskDetailResults = useQueries({
    queries: documentTaskIds.map((taskId) => ({
      queryKey: taskQueryKeys.detail(taskId),
      queryFn: () => tasksApi.get(taskId),
    })),
  });
  const completedCountByTask = new Map(
    taskDetailResults.flatMap((result) =>
      result.data ? [[result.data.taskId, result.data.completedDocumentCount] as const] : [],
    ),
  );

  /** 체류 기간 변경은 즉시 화면에 반영(낙관적 업데이트)하고, 실패하면 이전 값으로 되돌림 */
  const updateBudgetMutation = useMutation({
    mutationFn: (newMonths: number) => roadmapsApi.updateBudget(roadmapId, { stayMonths: newMonths }),
    onMutate: async (newMonths) => {
      await queryClient.cancelQueries({ queryKey: roadmapQueryKeys.detail(roadmapId) });
      const previous = queryClient.getQueryData<RoadmapDetailResult>(roadmapQueryKeys.detail(roadmapId));
      queryClient.setQueryData<RoadmapDetailResult>(roadmapQueryKeys.detail(roadmapId), (old) =>
        old ? { ...old, stayMonths: newMonths } : old,
      );
      return { previous };
    },
    onError: (_error, _newMonths, context) => {
      console.error('예산 계획 변경 실패');
      if (context?.previous) queryClient.setQueryData(roadmapQueryKeys.detail(roadmapId), context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.detail(roadmapId) }),
  });

  const updateScheduleMutation = useMutation({
    mutationFn: (departureDate: string) => roadmapsApi.updateSchedule(roadmapId, { departureDate }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.detail(roadmapId) }),
    onError: () => console.error('출국일 변경 실패'),
  });

  // isPending으로 판단해야 조회가 에러로 끝났을 때 스켈레톤에 갇히지 않고 안내 문구로 넘어간다
  if (isValidRoadmapId && isPending && !isError) {
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

  const handleSelectDeparture = (day: number) => {
    setDatePickerTarget(null);
    const iso = `${datePickerViewYear}-${String(datePickerViewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    updateScheduleMutation.mutate(iso);
  };

  const departureDate = formatDotDate(detail.departureDate);
  const parsedDeparture = parseDotDate(departureDate);
  const parsedStart = parseDotDate(startDate);

  const months = detail.stayMonths ?? 1;
  const budget = detail.budget;
  const livingCostSubtotal = (budget?.monthlyCost ?? 0) * months;
  const totalBudget = budget?.totalCost ?? (budget?.initialSettlementCost ?? 0) + livingCostSubtotal;

  // 상세 API도 도시명이 영문으로, country 정보는 아예 안 내려줘서 시드 데이터 기반 한글 매핑으로 대신 채움
  const cityInfo = CITY_INFO_KO[detail.cityId];
  const cityNameKo = cityInfo?.cityName ?? detail.cityName;

  /**
   * AI 탐색 리포트에 쓸 도시 정보는 로드맵 API에 없어서 도시 카탈로그에서 찾아 씀.
   * 아직 못 받았거나 카탈로그에 없는 도시면 로드맵이 아는 값만으로 최소한을 채운다.
   */
  const catalogCity = cityCatalog?.find((city) => city.cityId === detail.cityId);
  const reportCityData: CityInsightData = catalogCity
    ? { ...toCityInsightData(catalogCity), imageUrl: detail.cityImageUrl }
    : {
        cityId: String(detail.cityId),
        cityName: cityNameKo,
        countryName: cityInfo?.countryName ?? '준비중',
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
        <CityHeroBanner cityName={cityNameKo} progressPercent={Math.round(detail.progressRate)} imageUrl={detail.cityImageUrl} />
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
            // 지난 달로 가면 달력을 열어도 고를 수 있는 날짜가 없어서 아예 못 넘어가게 막는다
            isPrevMonthDisabled={
              datePickerViewYear === getToday().year
                ? datePickerViewMonth <= getToday().month
                : datePickerViewYear < getToday().year
            }
            startDate={startDate}
            /*
             * 달력은 헤더에 표시된 달에서 그대로 열린다.
             * 이미 잡힌 날짜의 달로 옮겨버리면 화살표로 옮겨둔 달이 무시돼서,
             * 헤더의 월 이동이 아무 의미가 없어진다.
             */
            onStartDateClick={() => {
              setDatePickerMode('day');
              setDatePickerTarget('start');
            }}
            departureDate={departureDate}
            onDepartureDateClick={() => {
              setDatePickerMode('day');
              setDatePickerTarget('departure');
            }}
          />
          <RoadmapTimeline
            tasks={detail.tasks.map((task) => toRoadmapTaskData(task, completedCountByTask.get(task.taskId)))}
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
                  // 출국일은 지난 날짜로 잡을 수 없어서 오늘 이전은 아예 못 고르게 막는다
                  minDate={getToday()}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-7.5">
          <BudgetPlanCard
            months={months}
            onMonthsChange={(newMonths) => updateBudgetMutation.mutate(newMonths)}
            initialSettlementCost={budget?.initialSettlementCost ?? 0}
            monthlyLivingCost={budget?.monthlyCost ?? 0}
            stayMonths={months}
            livingCostSubtotal={livingCostSubtotal}
            totalBudget={totalBudget}
          />
          <AiReportCard
            score={catalogCity?.rating ?? 0}
            cityName={cityNameKo}
            summary={catalogCity?.description ?? '준비중'}
            onViewReport={() => setIsReportOpen(true)}
          />
        </div>
      </div>

      <Outlet />

      {isReportOpen && (
        <CityReportModal
          isOpen
          onClose={() => setIsReportOpen(false)}
          data={buildCityReportData(reportCityData)}
          onSearch={(question) => cityAiReportApi.askQuestion(Number(reportCityData.cityId), { question })}
          // 이 화면은 이미 만들어진 로드맵의 상세라, 같은 도시를 또 추가할 일이 없음
          isAddDisabled
        />
      )}
    </div>
  );
}
