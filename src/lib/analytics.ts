import * as amplitude from '@amplitude/unified';
import type { TaskCategory } from '../features/roadmap/types/api';

/**
 * Amplitude 커스텀 이벤트 모음.
 *
 * 이벤트 이름/속성을 여기 한 곳에 모아두는 이유 — 같은 행동에 대해 화면마다
 * 다른 이름(Signed Up / signup / user_signed_up)이 생기면 대시보드에서
 * 서로 다른 지표로 쪼개져 집계가 무의미해진다.
 *
 * 페이지뷰·세션·클릭·UTM 유입은 autocapture가 자동으로 수집하므로 여기 넣지 않는다.
 */

/** 가입 경로 — 이메일 폼과 Google OAuth 두 갈래가 있다. */
type SignupMethod = 'email' | 'google';

/** 회원가입 완료. 광고 유입 대비 전환율을 보는 기준 이벤트. */
export function trackSignedUp(method: SignupMethod) {
  amplitude.track('Signed Up', { method });
}

/**
 * AI 브리핑 질문 제출. 홈 입력창과 채팅 패널 입력이 모두
 * submitQuery를 거치므로 그 한 곳에서만 호출한다.
 *
 * @param isRefine 기존 세션에 이어 되묻는 질문이면 true(첫 질문이면 false)
 */
export function trackSubmittedAiPrompt(isRefine: boolean) {
  amplitude.track('Submitted AI Prompt', { is_refine: isRefine });
}

/**
 * 로드맵 타임라인에서 태스크 카드를 열었을 때.
 *
 * 카테고리별로 이벤트를 나누지 않고 category 속성으로 구분한다 —
 * Amplitude에서 속성 기준 세그먼트가 가능하고, 카테고리가 늘어나도
 * 코드를 고칠 필요가 없다. 숙소/보험/항공권/재정이 제휴 후보.
 */
export function trackSelectedRoadmapTask(category: TaskCategory, taskName: string) {
  amplitude.track('Selected Roadmap Task', { category, task_name: taskName });
}
