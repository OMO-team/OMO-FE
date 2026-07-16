import type {
  RoadmapTaskData,
  BudgetPlanData,
  AiReportData,
  RequiredDocumentData,
  CountryGroupData,
} from '../types/roadmap';

/** 타임라인 순서(F-502 스펙): 여권 → 어학 → 숙소 → 재정 → 비자 → 항공권 */
export const berlinRoadmapTasks: RoadmapTaskData[] = [
  { status: 'success', dDay: '000', date: '2026.04.15', category: '여권', title: '여권 발급 신청' },
  { status: 'success', dDay: '000', date: '2026.04.15', category: '어학', title: '어학 성적 제출' },
  {
    status: 'ongoing',
    dDay: '15',
    date: '2026.08.05',
    category: '숙소',
    title: '임시숙소 예약',
    stepsCompleted: 3,
    stepsTotal: 4,
  },
  { status: 'upcoming', dDay: '30', date: '2026.04.15', category: '재정', title: '재정증명서 준비' },
  { status: 'upcoming', dDay: '45', date: '2026.08.21', category: '비자', title: '비자 신청 서류 준비' },
  {
    status: 'lock',
    date: '2026.09.01',
    category: '항공권',
    title: '항공권 예약',
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
  {
    name: '졸업 증명서',
    subtitle: '파싱 완료',
    status: 'done',
    tag: 'OCR 지원',
    uploadedFiles: ['졸업증명서_스캔본.pdf', '졸업증명서_원본.jpg'],
  },
  { name: '성적 증명서', subtitle: '파싱 완료', status: 'done', uploadedFiles: ['성적증명서.pdf'] },
  {
    name: '재학 증명서',
    subtitle: '파싱 완료',
    status: 'processing',
    tag: 'OCR 지원',
    scanStatus: '문서 스캔 중 ...',
    scanProgressPercent: 80,
    scanDetail: '이미지 분석중 · AI 텍스트 추출 중',
  },
  { name: '통장 잔고 증명서', subtitle: '파일을 업로드해주세요', status: 'pending', tag: 'OCR 지원' },
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
    cities: [{ ...berlinCard, isWished: true }, { ...berlinCard, cityName: '뮌헨' }],
  },
  {
    countryName: '프랑스',
    cityCount: 2,
    cities: [
      { ...berlinCard, cityName: '파리', countryName: '프랑스', isWished: true },
      { ...berlinCard, cityName: '리옹', countryName: '프랑스' },
    ],
  },
  {
    countryName: '스페인',
    cityCount: 2,
    cities: [
      { ...berlinCard, cityName: '마드리드', countryName: '스페인' },
      { ...berlinCard, cityName: '바르셀로나', countryName: '스페인' },
    ],
  },
  {
    countryName: '이탈리아',
    cityCount: 1,
    cities: [{ ...berlinCard, cityName: '로마', countryName: '이탈리아' }],
  },
  {
    countryName: '영국',
    cityCount: 2,
    cities: [
      { ...berlinCard, cityName: '런던', countryName: '영국' },
      { ...berlinCard, cityName: '맨체스터', countryName: '영국' },
    ],
  },
];
