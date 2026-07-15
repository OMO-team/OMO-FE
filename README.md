# OMO - 해외 생활 준비 플랫폼

> 워킹홀리데이·교환학생·인턴십을 준비하는 모든 사람을 위한 AI 기반 해외 생활 정보 플랫폼

<br />

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [기술 스택](#기술-스택)
- [폴더 구조](#폴더-구조)
- [실행 방법](#실행-방법)
- [화면 목록 및 사용자 흐름](#화면-목록-및-사용자-흐름)
- [컨벤션](#컨벤션)

<br />

## 프로젝트 소개

말하면 찾아주고, 고르면 준비된다.

**OMO**는 해외 체류를 준비하는 사용자가 자연어 AI 검색을 통해 자신에게 맞는 도시를 찾고, 도시 비교, 예산 확인, 서류 준비 로드맵까지 한 번에 관리할 수 있도록 돕는 해외 준비 플랫폼입니다.


| 핵심 기능 | 설명 |
|---|---|
| 🏙️ 도시 탐색 | 워킹홀리데이·교환학생·인턴십별 추천 도시 탐색 |
| 🤖 AI 도시 리포트 | 도시별 생활비·치안·선호도 점수, 장단점, 실제 후기 제공 |
| ⚖️ 도시 비교 | 여러 도시의 지표를 나란히 비교 |
| 🗺️ 로드맵 | 비자·숙소·항공권 등 준비 단계별 타임라인 및 예산 관리 |
| ⚙️ 설정 | 프로필 관리, 알림·동기화 설정 |

<br />

## 기술 스택

### Frontend

| 분류 | 기술 |
|---|---|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 |
| 상태 관리 | Zustand |
| Linter | ESLint |
| Formatter | Prettier |

<br />

## 폴더 구조

```
src/
├── features/                   # 도메인별 기능 모듈
│   ├── home/
│   │   └── components/         # 메인 홈 컴포넌트 (AIPromptSection, CityCard 등)
│   ├── city-insight/
│   │   └── components/         # 도시 인사이트 카드
│   ├── city-ai-report/
│   │   ├── components/         # AI 리포트 구성 컴포넌트
│   │   ├── mocks/              # 목업 데이터
│   │   └── index.ts            # public API
│   ├── compare/
│   │   ├── components/         # 도시 비교 컴포넌트
│   │   └── store/              # Zustand 스토어
│   ├── roadmap/
│   │   ├── components/         # 로드맵 컴포넌트
│   │   │   └── icons/          # 로드맵 전용 아이콘
│   │   ├── pages/              # 로드맵 페이지 (목록, 상세)
│   │   ├── types/              # 로드맵 타입 정의
│   │   └── mocks/              # 목업 데이터
│   └── settings/
│       ├── components/         # 설정 컴포넌트 (ToggleSwitch, ProfileCard 등)
│       └── pages/              # 설정 페이지
│
├── shared/                     # 여러 feature에서 공통으로 사용하는 리소스
│   ├── components/             # 공통 컴포넌트 (Header, Footer, Chip 등)
│   ├── types/                  # 공유 타입 (cityReport, compare)
│   └── mocks/                  # 공유 목업 데이터
│
├── assets/                     # 이미지, 아이콘 등 정적 파일
│   ├── icons/
│   └── images/
│
├── App.tsx
├── main.tsx
└── index.css
```

<br />

## 실행 방법

### 사전 준비

- Node.js 18+
- npm 또는 pnpm

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/OMO-team/OMO-FE.git
cd OMO-FE

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

### 주요 스크립트

```bash
npm run dev           # 개발 서버 실행 (http://localhost:5173)
npm run build         # 프로덕션 빌드
npm run lint          # ESLint 검사
npm run format        # Prettier 자동 포맷
npm run format:check  # Prettier 포맷 위반 여부 확인 (CI용)
```

<br />

## 화면 목록 및 사용자 흐름

### 화면 목록

| 화면 | 경로 | 설명 |
|---|---|---|
| 메인 홈 | `/` | 카테고리별 추천 도시, AI 프롬프트 검색 |
| 도시 인사이트 | `/city/:cityId` | 도시 상세 정보 카드 |
| AI 도시 리포트 | `/city/:cityId/report` | 점수·요약·장단점·브이로그·리뷰 |
| 도시 비교 | `/compare` | 두 도시 지표 나란히 비교 |
| 로드맵 목록 | `/roadmap` | 저장한 국가/도시별 로드맵 |
| 로드맵 상세 | `/roadmap/:cityId` | 타임라인·예산·AI 리포트·서류 업로드 |
| 설정 | `/settings` | 프로필·알림·계정 설정 |

### 사용자 흐름

```
[메인 홈]
    │
    ├─ 카테고리 선택 (워킹홀리데이 / 교환학생 / 인턴십)
    │       └─ 도시 카드 탐색
    │               └─ [도시 인사이트]
    │                       └─ [AI 도시 리포트]
    │                               ├─ 점수 · 요약 · 장단점 확인
    │                               ├─ 브이로그 · 실제 후기 확인
    │                               └─ AI 검색으로 추가 질문
    │
    ├─ AI 프롬프트 입력
    │       └─ 맞춤 도시 추천 결과
    │
    └─ 도시 비교 [Compare Bar]
            └─ [도시 비교 모달]
                    └─ 두 도시 지표 비교

[로드맵 목록]
    └─ 도시별 로드맵 카드
            └─ [로드맵 상세]
                    ├─ 타임라인 (여권 → 어학 → 숙소 → 재정 → 비자 → 항공권)
                    ├─ 예산 계획 (초기 정착금 · 월 생활비 슬라이더)
                    ├─ AI 리포트 카드
                    └─ 서류 업로드 · 아포스티유 공증 관리

[설정]
    ├─ 프로필 확인 · 수정
    ├─ 푸시 알림 · 자동 동기화 토글
    ├─ 비밀번호 변경 · 이용약관
    └─ 로그아웃 · 계정 탈퇴
```

<br />

## 컨벤션

### 브랜치 전략

| 브랜치 | 역할 |
|---|---|
| `main` | 항상 배포 가능한 상태. PR로만 merge |
| `dev` | 다음 배포를 준비하는 통합 브랜치 |
| `feat/*` | 기능 개발 브랜치. 완료 후 `dev`로 PR |

### 브랜치 네이밍

구조: `Prefix/#이슈번호-설명` (kebab-case)

| Prefix | 설명 | 예시 |
|---|---|---|
| `feat` | 새로운 기능 추가 | `feat/#10-login-api` |
| `fix` | 버그 수정 | `fix/#23-header-layout` |
| `docs` | 문서 수정 | `docs/#5-update-readme` |
| `style` | 코드 포맷팅 (로직 변경 없음) | `style/#12-format-code` |
| `refactor` | 코드 리팩토링 | `refactor/#30-user-service` |
| `test` | 테스트 코드 | `test/#15-login-test` |
| `chore` | 설정 파일, 패키지 매니저 등 | `chore/#2-setting-eslint` |
| `hotfix` | 운영 긴급 버그 수정 | `hotfix/#99-payment-error` |

### 커밋 메시지

```
type: Subject (#이슈번호)

Body (선택: 무엇을, 왜 변경했는지 상세 설명)

Footer (선택: Closes #이슈번호)
```

| 태그 | 설명 | 예시 |
|---|---|---|
| `feat` | 새로운 기능 추가 | `feat: 회원가입 API 구현 (#10)` |
| `fix` | 버그 수정 | `fix: 로그인 토큰 만료 오류 수정 (#23)` |
| `docs` | 문서 수정 | `docs: API 명세서 업데이트 (#5)` |
| `style` | 코드 스타일 변경 | `style: 코드 포맷팅 적용 (#12)` |
| `refactor` | 리팩토링 (기능 변경 없음) | `refactor: 사용자 조회 로직 개선 (#30)` |
| `test` | 테스트 코드 | `test: 회원가입 성공 테스트 작성 (#15)` |
| `chore` | 빌드·패키지 설정 | `chore: 라이브러리 버전 업데이트 (#2)` |
| `rename` | 파일·폴더 이동/이름 변경 | `rename: 이미지 경로 변경 (#8)` |
| `remove` | 파일 삭제 | `remove: 사용하지 않는 로고 삭제 (#9)` |

### Issue 컨벤션

| 항목 | 작성 방법 |
|---|---|
| 제목 | `[Prefix] 작업 내용 요약` (예: `[Feat] 소셜 로그인 기능 구현`) |
| 설명 | 작업의 배경 및 목적 |
| 할 일 | 체크박스 Task List |
| 참고 | 디자인 시안, 참고 문서 링크 등 |

### PR 컨벤션

| 항목 | 작성 방법 |
|---|---|
| 제목 | `[Prefix] 작업 내용 요약` |
| 관련 이슈 | `Closes #이슈번호` |
| 작업 내용 | 변경 사항 핵심 요약 |
| 스크린샷 | UI 변경 시 이미지 첨부 |
| 특이사항 | 리뷰어가 집중해서 봐줬으면 하는 부분 |

> PR은 최소 1명 Approve 후 merge 가능

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|---|---|---|
| 폴더명 | camelCase | `profileSetup`, `onBoarding` |
| 컴포넌트 파일명 | PascalCase | `MyComponent`, `ToggleSwitch` |
| 변수명 | camelCase | `const [isLoading, setIsLoading] = useState(false)` |
