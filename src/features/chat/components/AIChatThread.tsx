import { useState } from 'react';
import thinkingIcon from '../../../assets/icons/icon-thinking.svg';
import checkConditionIcon from '../../../assets/icons/icon-check-condition.svg';
import chevronRightBlueIcon from '../../../assets/icons/icon-chevron-right-blue.svg';
import externalLinkIcon from '../../../assets/icons/icon-external-link.svg';
import UserChatBubble from './UserChatBubble';

const MOCK_THINKING_SECONDS = 21;
const MOCK_USER_MESSAGE = '영어만으로 생활이 가능하면서 치안이 우수한 도시를 추천해줘';
const MOCK_AI_PARAGRAPHS = [
  "영어만으로 생활이 가능하면서 치안이 우수한 도시로는 호주의 '시드니'와 독일의 '뮌헨'을 가장 추천합니다.특히 뮌헨은 독일 내 치안 1위 도시이며 대학교 및 인턴십 환경에서 영어가 널리 통용됩니다.",
  '월 200만 원 이하의 예산을 맞추기 위해서는 시티 외곽의 쉐어하우스를 우선적으로 고려해 보세요.',
];
const MOCK_CONDITIONS = ['치안 우수 (4점 이상)', '영어 소통 가능', '예산 250만원 이하'];
const MOCK_REFERENCES: { type: '블로그' | '보고서'; title: string }[] = [
  { type: '블로그', title: '영어만으로 살아남는 유럽 생활기( 일년 살기, 독일살이)' },
  { type: '보고서', title: '2024 글로벌 도시 치안 및 생활비 통계 자료' },
];

const CATEGORY_TAG_STYLES = {
  블로그: { bgClass: 'bg-secondary-50', textClass: 'text-secondary-700' },
  보고서: { bgClass: 'bg-primary-50', textClass: 'text-primary-700' },
} as const;

const divider = (
  <div
    className="bg-gray-100 flex-shrink-0"
    style={{ width: '360px', height: '2px', borderRadius: '10px' }}
  />
);

export default function AIChatThread() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div
      className="flex flex-col items-center"
      style={{ padding: '0 50px', gap: '4px', alignSelf: 'stretch' }}
    >
      <div className="flex flex-col items-start" style={{ alignSelf: 'stretch' }}>

        {/* 유저 메시지 (우측 정렬) */}
        <div
          className="flex flex-col items-end"
          style={{ padding: '40px 0 40px 160px', gap: '4px', alignSelf: 'stretch' }}
        >
          <UserChatBubble text={MOCK_USER_MESSAGE} />
        </div>

        {/* AI 응답 영역 */}
        <div className="flex flex-col items-start gap-2" style={{ width: '360px' }}>

          {/* 생각 중 표시 */}
          <div className="flex items-center gap-2">
            <div className="size-icon-md flex items-center justify-center">
              <img src={thinkingIcon} alt="생각 중" width={18} height={20} />
            </div>
            <span className="body-04 text-gray-300">{MOCK_THINKING_SECONDS}s 동안 생각함</span>
          </div>

          {/* AI 응답 본문 */}
          <div className="flex flex-col items-start gap-6" style={{ alignSelf: 'stretch' }}>
            <div className="flex flex-col items-start gap-[30px]" style={{ alignSelf: 'stretch' }}>
              <div className="flex flex-col items-start gap-4" style={{ alignSelf: 'stretch' }}>
                <div className="flex flex-col items-start gap-6" style={{ alignSelf: 'stretch' }}>

                  {/* 텍스트 단락 */}
                  <div className="flex flex-col items-start gap-3" style={{ alignSelf: 'stretch' }}>
                    {MOCK_AI_PARAGRAPHS.map((text, i) => (
                      <>
                        <p
                          key={text}
                          className="text-black"
                          style={{
                            fontFamily: 'var(--font-pretendard)',
                            fontSize: '14px',
                            fontWeight: 400,
                            lineHeight: '150%',
                            letterSpacing: '-0.28px',
                            alignSelf: 'stretch',
                          }}
                        >
                          {text}
                        </p>
                        {i < MOCK_AI_PARAGRAPHS.length - 1 && divider}
                      </>
                    ))}
                  </div>

                  {/* 조건 칩 */}
                  <div className="flex flex-col items-start gap-2" style={{ width: '265px' }}>
                    <div className="flex items-center gap-2 flex-wrap" style={{ alignSelf: 'stretch' }}>
                      {MOCK_CONDITIONS.map((condition) => (
                        <div
                          key={condition}
                          className="flex items-center justify-center gap-1 rounded-2 bg-primary-50"
                          style={{ padding: '4px 10px 4px 8px' }}
                        >
                          <div className="size-icon-sm flex items-center justify-center flex-shrink-0">
                            <img src={checkConditionIcon} alt="체크" width={14} height={10} />
                          </div>
                          <span className="body-04 text-primary-700">{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 추천 도시 보러가기 */}
                <div className="flex items-start gap-1" style={{ alignSelf: 'stretch' }}>
                  <a
                    href="#"
                    className="body-02 text-primary-500 underline"
                    style={{ textDecorationStyle: 'solid' }}
                  >
                    추천 도시 보러가기
                  </a>
                  <div className="size-icon-sm flex items-center justify-center">
                    <img src={chevronRightBlueIcon} alt="이동" width={6} height={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="flex flex-col items-start" style={{ alignSelf: 'stretch' }}>
              {divider}
            </div>

            {/* 참고자료 레이블 */}
            <div
              className="flex items-center gap-1"
              style={{ padding: '12px 16px 8px 16px', alignSelf: 'stretch' }}
            >
              <span className="body-04 text-gray-500">참고자료</span>
            </div>

            {/* 참고자료 카드 목록 */}
            <div className="flex flex-col items-start gap-2" style={{ width: '317px' }}>
              {MOCK_REFERENCES.map((ref) => {
                const tagStyle = CATEGORY_TAG_STYLES[ref.type];
                return (
                  <div
                    key={ref.title}
                    onMouseEnter={() => setHoveredCard(ref.title)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`flex flex-col items-start gap-1 rounded-2 border border-gray-100 cursor-pointer transition-colors ${hoveredCard === ref.title ? 'bg-gray-50' : 'bg-white'}`}
                    style={{ padding: '8px 16px', alignSelf: 'stretch' }}
                  >
                    <div className="flex items-center justify-center gap-2" style={{ height: '26px', alignSelf: 'stretch' }}>
                      <div className="flex items-center gap-2">
                        {/* S_Category_Tag */}
                        <div
                          className={`flex items-center justify-center gap-1 rounded-2 flex-shrink-0 ${tagStyle.bgClass}`}
                          style={{ height: '24px', padding: '4px 12px' }}
                        >
                          <span className={`body-05 ${tagStyle.textClass}`}>{ref.type}</span>
                        </div>
                        {/* 제목 */}
                        <span
                          className="body-04 text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{ width: '194px' }}
                        >
                          {ref.title}
                        </span>
                      </div>
                      <div className="size-icon-sm flex items-center justify-center flex-shrink-0">
                        <img src={externalLinkIcon} alt="외부 링크" width={16} height={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
