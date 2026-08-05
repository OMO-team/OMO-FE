import type { CityReportData } from '../../../shared/types/cityReport';

export const berlinReportData: CityReportData = {
  cityId: 27,
  cityName: '베를린',
  heroImageUrl: '/src/assets/berlin.jpg',
  ratingBadge: 4.5,
  totalScore: 4.5,
  oneLineSummary: '다양한 문화와 학생 친화적인 환경이 어우러진 열린 배움의 도시',
  searchKeywords: ['비자 신청 절차', '주거비용', '아르바이트 구하기', '보험 가입', '여행지 추천'],
  vlogs: [
    { id: '1', tag: '독일살이', title: '베를린 워홀 브이로그 #1 첫날' },
    { id: '2', tag: '유럽 워홀러', title: '베를린에서 일자리 구하는 법' },
    { id: '3', tag: 'Berlin Life', title: '베를린 생활비 공개' },
    { id: '4', tag: '독일 워홀', title: '베를린 집 구하기 팁' },
  ],
  reviews: [
    {
      id: '1',
      authorInitial: '김',
      authorName: '김민지',
      rating: 5,
      content: '정말 살기 좋은 도시예요. 물가도 합리적이고 사람들도 친절해요!',
    },
    {
      id: '2',
      authorInitial: '이',
      authorName: '이준호',
      rating: 4,
      content: '거울만 빼면 완벽합니다. 여름엔 정말 최고',
    },
  ],
};
