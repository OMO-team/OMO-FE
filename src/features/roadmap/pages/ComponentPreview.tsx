import { useState } from 'react';
import CityRoadmapCard from '../components/CityRoadmapCard';
import TimeLineTaskCard from '../components/TimeLineTaskCard';
import BudgetPlanCard from '../components/BudgetPlanCard';
import CityHeroBanner from '../components/CityHeroBanner';
import RoadmapHeader from '../components/RoadmapHeader';
import RoadmapTimeline from '../components/RoadmapTimeline';
import DatePickerModal from '../components/DatePickerModal';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import EmptyStateIcon from '../components/EmptyStateIcon';
import RoadmapAlertCard from '../components/RoadmapAlertCard';
import LockOutlineIcon from '../components/icons/LockOutlineIcon';
import ScanFailIcon from '../components/icons/ScanFailIcon';
import CalendarErrorIcon from '../components/icons/CalendarErrorIcon';
import RoadmapDetailSkeleton from './RoadmapDetailSkeleton';
import CountryRoadmapListSkeleton from './CountryRoadmapListSkeleton';
import Footer from '../../../shared/components/Footer';
import NetworkErrorBanner from '../../../shared/components/NetworkErrorBanner';
import WifiOffIcon from '../../../shared/components/icons/WifiOffIcon';
import ServerErrorIcon from '../../../shared/components/icons/ServerErrorIcon';
import ClockDelayIcon from '../../../shared/components/icons/ClockDelayIcon';
import RefreshIcon from '../../../shared/components/icons/RefreshIcon';
import {
  berlinRoadmapTasks,
  berlinBudgetPlan,
  apostilleRequiredDocuments,
  countryRoadmapGroups,
} from '../mocks/mockData';

export default function ComponentPreview() {
  const [months, setMonths] = useState(berlinBudgetPlan.months);
  const cityCard = countryRoadmapGroups[0].cities[0];

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-gray-50 p-10">
      <CityHeroBanner cityName="베를린" progressPercent={43} imageUrl={cityCard.imageUrl} />

      <RoadmapHeader year={2026} month={4} departureDate="2026년 06월 21일" />

      <CityRoadmapCard {...cityCard} />

      <div className="flex flex-col gap-2">
        {berlinRoadmapTasks.map((task, i) => <TimeLineTaskCard key={`${task.title}-${i}`} {...task} />)}
      </div>

      <RoadmapTimeline tasks={berlinRoadmapTasks} />

      <BudgetPlanCard {...berlinBudgetPlan} months={months} onMonthsChange={setMonths} />

      <DocumentTaskDetailModal
        category="비자"
        title="아포스티유 공증"
        infoBanner="해외에서 한국 학력을 인정받기 위해 필요한 공증 절차입니다. 외교부 영사민원24를 통해 온라인으로 신청할 수 있습니다."
        completedCount={2}
        totalCount={4}
        documents={apostilleRequiredDocuments}
        dDayLabel="D-000"
        scheduledDate="2026.04.15"
      />

      <div className="flex gap-6">
        <DatePickerModal mode="day" year={2026} month={4} selectedDay={15} />
        <DatePickerModal mode="month" year={2026} month={4} selectedMonth={4} />
      </div>

      <EmptyStateIcon />

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
          icon={<RefreshIcon className="size-full" />}
          message="요청이 많아 잠시 후 이용 가능해요"
        />
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <RoadmapDetailSkeleton />
        <CountryRoadmapListSkeleton />
      </div>

      <Footer />
    </div>
  );
}
