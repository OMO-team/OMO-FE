import type { CityReportData, AISearchResultData } from "../types/cityReport";

export const berlinReportData: CityReportData = {
  cityName: "베를린",
  heroImageUrl: "/src/assets/berlin.jpg",
  ratingBadge: 4.5,
  totalScore: 4.5,
  oneLineSummary:
    "다양한 문화와 학생 친화적인 환경이 어우러진 열린 배움의 도시",
  searchKeywords: [
    "비자 신청 절차",
    "주거비용",
    "아르바이트 구하기",
    "보험 가입",
    "여행지 추천",
  ],
  keySummary: [
    {
      id: "1",
      title: "행정 절차",
      description: "비자 신청은 온라인으로 가능하며 평균 4-6주 소요됩니다.",
    },
    {
      id: "2",
      title: "비용 안내",
      description: "월 평균 생활비 180만원, 초기 정착금 500만원 권장",
    },
    {
      id: "3",
      title: "숙소 정보",
      description: "WG(쉐어하우스)가 일반적이며 월 60-80만원 수준",
    },
    {
      id: "4",
      title: "학점 인정",
      description: "대부분의 한국 대학과 학점 교류 협정 체결",
    },
    {
      id: "5",
      title: "생활 문화",
      description: "자전거 문화 발달, 주말 박물관 무료 개방 다수",
    },
    {
      id: "6",
      title: "어학 정보",
      description: "영어 사용 가능, 독일어 B1 수준 권장",
    },
  ],
  keyMetrics: [
    { id: "1", label: "생활비", percentage: 60, barColor: "gray" },
    { id: "2", label: "인터넷", percentage: 85, barColor: "gradient" },
    { id: "3", label: "치안", percentage: 75, barColor: "gray" },
    { id: "4", label: "선호도", percentage: 70, barColor: "gradient" },
  ],
  pros: [
    "합리적인 생활비",
    "활발한 스타트업 씬",
    "대중교통 발달",
    "다양한 문화 행사",
  ],
  cons: ["겨울이 길고 추움", "관공서 처리 느림", "독일어 필수인 경우 많음"],
  vlogs: [
    { id: "1", tag: "독일살이", title: "베를린 워홀 브이로그 #1 첫날" },
    { id: "2", tag: "유럽 워홀러", title: "베를린에서 일자리 구하는 법" },
    { id: "3", tag: "Berlin Life", title: "베를린 생활비 공개" },
    { id: "4", tag: "독일 워홀", title: "베를린 집 구하기 팁" },
  ],
  reviews: [
    {
      id: "1",
      authorInitial: "김",
      authorName: "김민지",
      rating: 5,
      content: "정말 살기 좋은 도시예요. 물가도 합리적이고 사람들도 친절해요!",
    },
    {
      id: "2",
      authorInitial: "이",
      authorName: "이준호",
      rating: 4,
      content: "거울만 빼면 완벽합니다. 여름엔 정말 최고",
    },
  ],
};

export const mockSearchResult = (query: string): AISearchResultData => ({
  answer: `베를린의 ${query}에 대한 정보입니다. 필요 서류는 여권, 재정증명서, 보험가입증명서입니다. 평균 처리기간은 4-6주이며 ...`,
  documents: [
    { id: "1", category: "비자", title: "독일 워킹홀리데이 비자 신청 가이드" },
    { id: "2", category: "숙소", title: "WG-Gesucht 사용법 완벽 정리" },
  ],
});
