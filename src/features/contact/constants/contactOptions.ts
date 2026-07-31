export const CONTACT_TYPE_OPTIONS = [
    '도시 탐색·AI 브리핑',
    '내 홈·준비 로드맵',
    '위시리스트·비교 기능',
    '계정·로그인·회원정보',
    '오류 신고(버그)',
    '서비스 제안·기타 문의'
] as const

export type ContactType = typeof CONTACT_TYPE_OPTIONS[number]

export const CONTACT_TYPE_MAP: Record<ContactType, string> = {
    '도시 탐색·AI 브리핑': 'CITY_EXPLORATION_AI_BRIEFING',
    '내 홈·준비 로드맵': 'HOME_ROADMAP',
    '위시리스트·비교 기능': 'WISHLIST_COMPARISON',
    '계정·로그인·회원정보': 'ACCOUNT',
    '오류 신고(버그)': 'BUG_REPORT',
    '서비스 제안·기타 문의': 'SERVICE_SUGGESTION_ETC'
}
