import type {
  RoadmapTaskData,
  BudgetPlanData,
  AiReportData,
  RequiredDocumentData,
  CountryGroupData,
  UploadedFileItem,
} from '../types/roadmap';
import type { CityInsightData } from '../types/cityInsight';
import countryCard1 from '../../../assets/images/country_card_1.png';
import countryCard2 from '../../../assets/images/country_card_2.png';
import countryCard3 from '../../../assets/images/country_card_3.png';

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
    taskDocumentId: 53,
    documentTemplateId: 7,
    name: '졸업 증명서',
    subtitle: '파싱 완료',
    isChecked: true,
    ocrSupport: true,
    displayOrder: 1,
    uploadedFiles: ['졸업증명서_스캔본.pdf', '졸업증명서_원본.jpg'],
  },
  {
    taskDocumentId: 54,
    documentTemplateId: 8,
    name: '성적 증명서',
    subtitle: '파싱 완료',
    isChecked: true,
    ocrSupport: false,
    displayOrder: 2,
    uploadedFiles: ['성적증명서.pdf'],
  },
  {
    taskDocumentId: 55,
    documentTemplateId: 9,
    name: '재학 증명서',
    subtitle: '파싱 완료',
    isChecked: false,
    ocrSupport: true,
    displayOrder: 3,
    isProcessing: true,
    scanStatus: '문서 스캔 중 ...',
    scanProgressPercent: 80,
    scanDetail: '이미지 분석중 · AI 텍스트 추출 중',
  },
  {
    taskDocumentId: 56,
    documentTemplateId: 10,
    name: '통장 잔고 증명서',
    subtitle: '파일을 업로드해주세요',
    isChecked: false,
    ocrSupport: true,
    displayOrder: 4,
  },
];

export const documentUploadFiles: UploadedFileItem[] = [
  { name: '졸업증명서.pdf', uploadedSizeMB: 2.4, totalSizeMB: 4, status: 'uploading' },
  { name: '재학증명서.doc', uploadedSizeMB: 2, totalSizeMB: 2, status: 'processing' },
  { name: '아포스티유_확인서.csv', uploadedSizeMB: 3, totalSizeMB: 3, status: 'completed' },
  { name: '통장잔고증명서.jpg', uploadedSizeMB: 1.2, totalSizeMB: 1.2, status: 'error' },
];

/** 지원 범위: 8개국 9개 도시 (워홀 6개국 / 인턴십 6개국 / 교환학생 4개국) */
const SUPPORTED_CITIES = [
  { cityId: 'berlin', cityName: '베를린', countryName: '독일', description: '활기찬 스타트업 문화와 합리적인 생활비', imageUrl: countryCard1 },
  { cityId: 'munich', cityName: '뮌헨', countryName: '독일', description: '명문 대학과 첨단 산업이 공존하는 도시', imageUrl: countryCard1 },
  { cityId: 'sydney', cityName: '시드니', countryName: '호주', description: '온화한 날씨와 다양한 워킹홀리데이 기회', imageUrl: countryCard2 },
  { cityId: 'dublin', cityName: '더블린', countryName: '아일랜드', description: 'IT·테크 기업이 밀집한 유럽의 관문', imageUrl: countryCard3 },
  { cityId: 'amsterdam', cityName: '암스테르담', countryName: '네덜란드', description: '자전거의 도시, 국제적인 학업 환경', imageUrl: countryCard1 },
  { cityId: 'auckland', cityName: '오클랜드', countryName: '뉴질랜드', description: '여유로운 자연과 워라밸이 좋은 도시', imageUrl: countryCard2 },
  { cityId: 'toronto', cityName: '토론토', countryName: '캐나다', description: '다문화가 어우러진 북미 취업 허브', imageUrl: countryCard3 },
  { cityId: 'london', cityName: '런던', countryName: '영국', description: '세계적인 대학과 금융의 중심지', imageUrl: countryCard1 },
  { cityId: 'taipei', cityName: '타이베이', countryName: '대만', description: '저렴한 물가와 가까운 거리의 아시아 도시', imageUrl: countryCard2 },
] as const;

export const countryRoadmapGroups: CountryGroupData[] = [
  {
    countryName: '독일',
    cityCount: 2,
    cities: [
      { ...SUPPORTED_CITIES[0], rating: 4.5, progressPercent: 43, costProgressPercent: 22, completedSteps: 0, totalSteps: 0, nextSchedule: '비자 신청서류 준비', isWished: true },
      { ...SUPPORTED_CITIES[1], rating: 4.3, progressPercent: 10, costProgressPercent: 15, completedSteps: 0, totalSteps: 0, nextSchedule: '어학 성적 제출' },
    ],
  },
  {
    countryName: '호주',
    cityCount: 1,
    cities: [
      { ...SUPPORTED_CITIES[2], rating: 4.7, progressPercent: 5, costProgressPercent: 8, completedSteps: 0, totalSteps: 0, nextSchedule: '여권 발급 신청' },
    ],
  },
  {
    countryName: '아일랜드',
    cityCount: 1,
    cities: [
      { ...SUPPORTED_CITIES[3], rating: 4.4, progressPercent: 0, costProgressPercent: 0, completedSteps: 0, totalSteps: 0, nextSchedule: '여권 발급 신청' },
    ],
  },
  {
    countryName: '네덜란드',
    cityCount: 1,
    cities: [
      { ...SUPPORTED_CITIES[4], rating: 4.6, progressPercent: 18, costProgressPercent: 12, completedSteps: 0, totalSteps: 0, nextSchedule: '어학 성적 제출', isWished: true },
    ],
  },
  {
    countryName: '뉴질랜드',
    cityCount: 1,
    cities: [
      { ...SUPPORTED_CITIES[5], rating: 4.5, progressPercent: 0, costProgressPercent: 0, completedSteps: 0, totalSteps: 0, nextSchedule: '여권 발급 신청' },
    ],
  },
  {
    countryName: '캐나다',
    cityCount: 1,
    cities: [
      { ...SUPPORTED_CITIES[6], rating: 4.5, progressPercent: 25, costProgressPercent: 20, completedSteps: 0, totalSteps: 0, nextSchedule: '숙소 예약' },
    ],
  },
  {
    countryName: '영국',
    cityCount: 1,
    cities: [
      { ...SUPPORTED_CITIES[7], rating: 4.8, progressPercent: 33, costProgressPercent: 28, completedSteps: 0, totalSteps: 0, nextSchedule: '비자 신청서류 준비' },
    ],
  },
  {
    countryName: '대만',
    cityCount: 1,
    cities: [
      { ...SUPPORTED_CITIES[8], rating: 4.5, progressPercent: 0, costProgressPercent: 0, completedSteps: 0, totalSteps: 0, nextSchedule: '여권 발급 신청' },
    ],
  },
];

/** 도시 인사이트 데이터 카탈로그 (9개 도시 전체) — 위시 여부와 무관하게 항상 존재하는 도시 정보 */
export const cityInsightCatalog: CityInsightData[] = [
  { cityId: 'berlin', cityName: '베를린', countryName: '독일', imageUrl: countryCard1, description: '활기찬 스타트업 문화와 합리적인 생활비', rating: 4.5, monthlyCost: '180만원', costPercent: 40, accommodationPercent: 88, accommodationLabel: '쉬움', visaPercent: 88, visaLabel: '쉬움', securityScore: 4.9, languageScore: 3.2, infrastructureScore: 4.9 },
  { cityId: 'munich', cityName: '뮌헨', countryName: '독일', imageUrl: countryCard1, description: '명문 대학과 첨단 산업이 공존하는 도시', rating: 4.3, monthlyCost: '210만원', costPercent: 55, accommodationPercent: 60, accommodationLabel: '보통', visaPercent: 88, visaLabel: '쉬움', securityScore: 4.8, languageScore: 3.0, infrastructureScore: 4.7 },
  { cityId: 'sydney', cityName: '시드니', countryName: '호주', imageUrl: countryCard2, description: '온화한 날씨와 시드니 하버브릿지가 있는 관문', rating: 4.5, monthlyCost: '280만원', costPercent: 70, accommodationPercent: 40, accommodationLabel: '어려움', visaPercent: 78, visaLabel: '쉬움', securityScore: 4.9, languageScore: 4.8, infrastructureScore: 4.7 },
  { cityId: 'dublin', cityName: '더블린', countryName: '아일랜드', imageUrl: countryCard3, description: 'IT·테크 기업이 밀집한 유럽의 관문', rating: 4.4, monthlyCost: '220만원', costPercent: 58, accommodationPercent: 35, accommodationLabel: '어려움', visaPercent: 88, visaLabel: '쉬움', securityScore: 4.9, languageScore: 4.9, infrastructureScore: 4.6 },
  { cityId: 'amsterdam', cityName: '암스테르담', countryName: '네덜란드', imageUrl: countryCard1, description: '자전거의 도시, 국제적인 학업 환경', rating: 4.6, monthlyCost: '230만원', costPercent: 60, accommodationPercent: 30, accommodationLabel: '어려움', visaPercent: 70, visaLabel: '보통', securityScore: 4.8, languageScore: 4.5, infrastructureScore: 4.9 },
  { cityId: 'auckland', cityName: '오클랜드', countryName: '뉴질랜드', imageUrl: countryCard2, description: '여유로운 자연과 워라밸이 좋은 도시', rating: 4.5, monthlyCost: '200만원', costPercent: 52, accommodationPercent: 55, accommodationLabel: '보통', visaPercent: 90, visaLabel: '쉬움', securityScore: 4.9, languageScore: 4.8, infrastructureScore: 4.3 },
  { cityId: 'toronto', cityName: '토론토', countryName: '캐나다', imageUrl: countryCard3, description: '다문화가 어우러진 북미 취업 허브', rating: 4.5, monthlyCost: '220만원', costPercent: 57, accommodationPercent: 33, accommodationLabel: '어려움', visaPercent: 65, visaLabel: '보통', securityScore: 4.7, languageScore: 4.7, infrastructureScore: 4.8 },
  { cityId: 'london', cityName: '런던', countryName: '영국', imageUrl: countryCard1, description: '세계적인 대학과 금융의 중심지', rating: 4.5, monthlyCost: '280만원', costPercent: 72, accommodationPercent: 25, accommodationLabel: '어려움', visaPercent: 60, visaLabel: '보통', securityScore: 4.6, languageScore: 4.9, infrastructureScore: 4.9 },
  { cityId: 'taipei', cityName: '타이베이', countryName: '대만', imageUrl: countryCard2, description: '저렴한 물가와 가까운 거리의 아시아 도시', rating: 4.5, monthlyCost: '130만원', costPercent: 25, accommodationPercent: 75, accommodationLabel: '쉬움', visaPercent: 85, visaLabel: '쉬움', securityScore: 4.8, languageScore: 3.5, infrastructureScore: 4.5 },
];

/** 하트가 켜진(위시 등록된) 초기 도시 ID 목록 */
export const initialWishedCityIds: string[] = ['berlin', 'sydney', 'amsterdam', 'munich'];
