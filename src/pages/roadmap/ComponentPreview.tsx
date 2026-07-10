import { useState } from 'react';
import CityRoadmapCard from '../../components/roadmap/CityRoadmapCard';
import TimeLineTaskCard from '../../components/roadmap/TimeLineTaskCard';
import BudgetPlanCard from '../../components/roadmap/BudgetPlanCard';
import CityHeroBanner from '../../components/roadmap/CityHeroBanner';
import RoadmapHeader from '../../components/roadmap/RoadmapHeader';
import RoadmapTimeline from '../../components/roadmap/RoadmapTimeline';
import DatePickerModal from '../../components/roadmap/DatePickerModal';
import DocumentTaskDetailModal from '../../components/roadmap/DocumentTaskDetailModal';
import EmptyStateIcon from '../../components/roadmap/EmptyStateIcon';
import Footer from '../../components/common/Footer';
import {
  berlinRoadmapTasks,
  berlinBudgetPlan,
  apostilleRequiredDocuments,
  countryRoadmapGroups,
} from '../../components/roadmap/mockData';

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

      <Footer />
    </div>
  );
}
