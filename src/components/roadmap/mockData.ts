import type {
  RoadmapTaskData,
  BudgetPlanData,
  AiReportData,
  RequiredDocumentData,
  CountryGroupData,
} from '../types/roadmap';

export const berlinRoadmapTasks: RoadmapTaskData[] = [
  { status: 'success', dDay: '000', date: '2026.04.15', category: '비자', title: '비자 신청 서류 준비' },
  { status: 'success', dDay: '000', date: '2026.04.15', category: '보험', title: '여행자 보험 가입' },
  {
    status: 'ongoing',
    dDay: '15',
    date: '2026.04.15',
    category: '서류',
    title: '아포스티유 공증',
    stepsCompleted: 3,
    stepsTotal: 4,
  },
  { status: 'upcoming', dDay: '30', date: '2026.04.15', category: '항공', title: '항공권 예약' },
  { status: 'upcoming', dDay: '45', date: '2026.06.21', category: '숙소', title: '임시숙소 예약' },
  {
    status: 'lock',
    date: '2026.04.15',
    category: '은행',
    title: '현지 계좌 개설',
    prerequisiteWarning: '선행 작업 완료 필요',
  },
];

export const berlinBudgetPlan: BudgetPlanData = {
  months: 12,
  initialSettlementCost: 500,
  monthlyLivingCost: 180,
  stayMonths: 13,
  livingCostSubtotal: 2340,
  totalBudget: 2340,
};

export const berlinAiReport: AiReportData = {
  score: 4.5,
  cityName: '베를린',
  summary: '다양한 문화와 학생 친화적인 환경이 어우러진 열린 배움의 도시',
};

export const apostilleRequiredDocuments: RequiredDocumentData[] = [
  { name: '졸업 증명서', subtitle: '파싱 완료', status: 'done' },
  { name: '성적 증명서', subtitle: '파싱 완료', status: 'done' },
  {
    name: '재학 증명서',
    subtitle: '파싱 완료',
    status: 'processing',
    tag: 'OCR 지원',
    scanStatus: '문서 스캔 중 ...',
    scanProgressPercent: 80,
    scanDetail: '이미지 분석중 · AI 텍스트 추출 중',
  },
];

const berlinCard = {
  cityName: '베를린',
  countryName: '독일',
  progressPercent: 43,
  description: '활기찬 스타트업 문화와 합리적인 생활비',
  rating: 4.5,
  costProgressPercent: 22,
  completedSteps: 0,
  totalSteps: 0,
  nextSchedule: '비자 신청서류 준비',
  imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600',
};

export const countryRoadmapGroups: CountryGroupData[] = [
  {
    countryName: '독일',
    cityCount: 4,
    cities: [berlinCard, { ...berlinCard, cityName: '뮌헨' }],
  },
  {
    countryName: '프랑스',
    cityCount: 2,
    cities: [
      { ...berlinCard, cityName: '파리', countryName: '프랑스' },
      { ...berlinCard, cityName: '리옹', countryName: '프랑스' },
    ],
  },
];
