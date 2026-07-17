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
  블로그: { bg: 'var(--color-secondary-50)', color: 'var(--color-secondary-700)' },
  보고서: { bg: 'var(--color-primary-50)', color: 'var(--color-primary-700)' },
} as const;

const divider = (
  <div
    style={{
      width: '360px',
      height: '2px',
      borderRadius: '10px',
      background: 'var(--color-gray-100)',
      flexShrink: 0,
    }}
  />
);

export default function AIChatThread() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  return (
    <div
      style={{
        display: 'flex',
        padding: '0 50px',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        alignSelf: 'stretch',
      }}
    >
      {/* Frame 11238 outer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch' }}>

        {/* Frame 11238 inner — 유저 메시지 (우측 정렬) */}
        <div
          style={{
            display: 'flex',
            padding: '40px 0 40px 160px',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px',
            alignSelf: 'stretch',
          }}
        >
          {/* User chat 버블 */}
          <UserChatBubble text={MOCK_USER_MESSAGE} />
        </div>

        {/* Frame 11235 — AI 응답 영역 */}
        <div
          style={{
            display: 'flex',
            width: '360px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          {/* Frame 11259 — 생각 중 표시 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={thinkingIcon} alt="생각 중" width={18} height={20} />
            </div>
            <span className="body-04" style={{ color: 'var(--color-gray-300)' }}>
              {MOCK_THINKING_SECONDS}s 동안 생각함
            </span>
          </div>

          {/* Frame 11232 — AI 응답 본문 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '24px',
              alignSelf: 'stretch',
            }}
          >
            {/* Frame 11258 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '30px', alignSelf: 'stretch' }}>

              {/* Frame 11256 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'stretch' }}>

                {/* Frame 11231 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px', alignSelf: 'stretch' }}>

                  {/* Frame 11223 — 텍스트 단락 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', alignSelf: 'stretch' }}>
                    {MOCK_AI_PARAGRAPHS.map((text, i) => (
                      <>
                        <p
                          key={text}
                          style={{
                            color: 'var(--color-black)',
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

                  {/* Frame 11220 — 조건 칩 */}
                  <div style={{ display: 'flex', width: '265px', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'stretch', flexWrap: 'wrap' }}>
                      {MOCK_CONDITIONS.map((condition) => (
                        <div
                          key={condition}
                          style={{
                            display: 'flex',
                            padding: '4px 10px 4px 8px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '4px',
                            borderRadius: '8px',
                            background: 'var(--color-primary-50)',
                          }}
                        >
                          <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <img src={checkConditionIcon} alt="체크" width={14} height={10} />
                          </div>
                          <span
                            className="body-04"
                            style={{ color: 'var(--color-primary-700)' }}
                          >
                            {condition}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Frame 11257 — 추천 도시 보러가기 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', alignSelf: 'stretch' }}>
                  <a
                    href="#"
                    className="body-02"
                    style={{
                      color: 'var(--color-primary-500)',
                      textDecorationLine: 'underline',
                      textDecorationStyle: 'solid',
                    }}
                  >
                    추천 도시 보러가기
                  </a>
                  <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={chevronRightBlueIcon} alt="이동" width={6} height={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* Frame 11230 — 구분선 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch' }}>
              {divider}
            </div>

            {/* Frame 11255 — 참고자료 레이블 */}
            <div
              style={{
                display: 'flex',
                padding: '12px 16px 8px 16px',
                alignItems: 'center',
                gap: '4px',
                alignSelf: 'stretch',
              }}
            >
              <span className="body-04" style={{ color: 'var(--color-gray-500)' }}>
                참고자료
              </span>
            </div>

            {/* Frame 11229 — 참고자료 카드 목록 */}
            <div
              style={{
                display: 'flex',
                width: '317px',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              {MOCK_REFERENCES.map((ref) => {
                const tagStyle = CATEGORY_TAG_STYLES[ref.type];
                return (
                  <div
                    key={ref.title}
                    onMouseEnter={() => setHoveredCard(ref.title)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: 'flex',
                      padding: '8px 16px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '4px',
                      alignSelf: 'stretch',
                      borderRadius: '8px',
                      border: '1px solid var(--color-gray-100)',
                      background: hoveredCard === ref.title ? 'var(--color-gray-50)' : 'var(--color-white)',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', height: '26px', justifyContent: 'center', alignItems: 'center', gap: '8px', alignSelf: 'stretch' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* S_Category_Tag */}
                        <div
                          style={{
                            display: 'flex',
                            height: '24px',
                            padding: '4px 12px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '4px',
                            borderRadius: '6px',
                            background: tagStyle.bg,
                            flexShrink: 0,
                          }}
                        >
                          <span className="body-05" style={{ color: tagStyle.color }}>
                            {ref.type}
                          </span>
                        </div>
                        {/* 제목 */}
                        <span
                          className="body-04"
                          style={{
                            width: '194px',
                            color: 'var(--color-gray-900)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ref.title}
                        </span>
                      </div>
                      {/* 외부 링크 아이콘 */}
                      <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
