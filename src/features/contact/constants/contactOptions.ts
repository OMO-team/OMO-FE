export const CONTACT_TYPE_OPTIONS = [
    '도시 탐색·AI 브리핑',
    '내 홈·준비 로드맵',
    '위시리스트·비교 기능',
    '계정·로그인·회원정보',
    '오류 / 버그 문의',
    '서비스 제안·기타 문의',
] as const

export type ContactType = typeof CONTACT_TYPE_OPTIONS[number]
