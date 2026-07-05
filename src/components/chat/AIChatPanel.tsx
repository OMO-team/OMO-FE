import { useState } from 'react';
import clipIcon from '../../assets/icons/icon-clip.svg';
import newChatIcon from '../../assets/icons/icon-new-chat.svg';
import collapseIcon from '../../assets/icons/icon-double-right-arrow.svg';
import arrowDownIcon from '../../assets/icons/icon-arrow-down[16].svg';
import arrowUpIcon from '../../assets/icons/icon-arrow-up.svg';

type ChatMessage = {
  id: string;
  role: 'user' | 'ai';
  content: string;
  tags?: string[];
  referenceLinks?: { type: string; title: string }[];
  isLoading?: boolean;
};

type AIChatPanelProps = {
  onClose?: () => void;
};

const SUGGESTION_CHIPS = [
  '치안이 좋고 영어로 생활 가능한 200만원 이하 도시',
  '유럽에서 생활비가 저렴하고 대중교통 좋은 곳',
  '아시아 워킹홀리데이 추천, 한 달 150만원 예산',
];

export default function AIChatPanel({ onClose }: AIChatPanelProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const isEmpty = messages.length === 0;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: input },
    ]);
    setInput('');
  };

  return (
    <div className="relative flex" style={{ width: '670px', height: '1080px', borderLeft: '1px solid #B8BFCB', background: '#FFF' }}>
      {/* Sidebar_Collapse_Handle */}
      <div
        className="absolute left-0 top-0 flex h-full cursor-pointer items-center pl-2"
        style={{ zIndex: 10 }}
        onClick={onClose}
      >
        <div
          className="rounded-[10px] transition-colors hover:bg-[#E7EAEF]"
          style={{ width: '6px', height: '120px', background: '#CFD3DA' }}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 flex-col" style={{ marginLeft: '14px' }}>
        {/* R_Header_AI_chat */}
        <div
          className="flex flex-shrink-0 items-center justify-between"
          style={{ padding: '40px 34px 10px 30px', borderBottom: '1px solid #E7EAEF' }}
        >
          {/* OMO 스마트 브리핑 버튼 */}
          <button
            type="button"
            className="flex items-center gap-1 transition-colors hover:bg-gray-50"
            style={{
              width: '206px',
              height: '40px',
              padding: '8px 18px',
              borderRadius: '12px',
            }}
          >
            <span
              style={{
                color: '#404959',
                fontFamily: 'Pretendard Variable',
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: '140%',
                letterSpacing: '-0.36px',
                whiteSpace: 'nowrap',
              }}
            >
              OMO 스마트 브리핑
            </span>
            <img
              src={arrowDownIcon}
              alt="드롭다운"
              style={{ width: '20px', height: '20px', transform: 'rotate(-90deg)', flexShrink: 0 }}
            />
          </button>

          {/* 우측 버튼들 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              style={{ width: '32px', height: '32px' }}
              aria-label="새 채팅"
            >
              <img src={newChatIcon} alt="새 채팅" style={{ width: '22px', height: '22px' }} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
              style={{ width: '32px', height: '32px' }}
              aria-label="패널 접기"
            >
              <img src={collapseIcon} alt="패널 접기" style={{ width: '14px', height: '16px' }} />
            </button>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto" style={{ paddingTop: '60px' }}>
            {isEmpty ? (
              /* Empty State — Frame 11240 */
              <div
                className="flex flex-col items-center"
                style={{ width: '570px', gap: '60px' }}
              >
                {/* Frame 11205 */}
                <div className="flex flex-col items-center" style={{ width: '500px', gap: '26px' }}>
                  {/* Frame 48 — 여행 아이콘 + 타이틀 */}
                  <div className="flex flex-col items-center gap-4">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="7" y="19" width="42" height="30" rx="4" stroke="#0085FF" strokeWidth="2.5" />
                      <path d="M19 19V13.5C19 11.567 20.567 10 22.5 10H33.5C35.433 10 37 11.567 37 13.5V19" stroke="#0085FF" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M7 31H49" stroke="#0085FF" strokeWidth="2.5" />
                      <circle cx="21" cy="49" r="2" fill="#0085FF" />
                      <circle cx="35" cy="49" r="2" fill="#0085FF" />
                    </svg>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <p
                        style={{
                          color: '#15181D',
                          fontFamily: 'Pretendard Variable',
                          fontSize: '22px',
                          fontWeight: 700,
                          lineHeight: '140%',
                          letterSpacing: '-0.66px',
                        }}
                      >
                        어느 나라로 떠나고 싶으신가요?
                      </p>
                      <p
                        style={{
                          color: '#566276',
                          fontFamily: 'Pretendard Variable',
                          fontSize: '14px',
                          fontWeight: 400,
                          lineHeight: '150%',
                          letterSpacing: '-0.28px',
                        }}
                      >
                        원하는 조건이나 예산을 자유롭게 적으면,
                        <br />
                        OMO AI가 딱 맞는 도시를 찾아드릴게요.
                      </p>
                    </div>
                  </div>

                  {/* Frame 11204 — 추천 칩 */}
                  <div className="flex flex-col items-start" style={{ width: '289px', gap: '8px' }}>
                    {SUGGESTION_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setInput(chip)}
                        className="flex items-center text-left transition-colors hover:bg-[#ECEEF2]"
                        style={{
                          width: '100%',
                          height: '42px',
                          padding: '10px 20px',
                          borderRadius: '12px',
                          background: '#F8F9FA',
                          border: 'none',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            color: '#404959',
                            fontFamily: 'Pretendard Variable',
                            fontSize: '13px',
                            fontWeight: 400,
                            lineHeight: '140%',
                            letterSpacing: '-0.26px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            display: 'block',
                            width: '100%',
                          }}
                        >
                          {chip}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* 채팅 메시지 목록 */
              <div className="flex w-full flex-col gap-6 p-6">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.role === 'user' ? (
                      <UserMessage content={msg.content} />
                    ) : (
                      <AIMessage message={msg} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* R_Prompt Input Container */}
          <ChatInput value={input} onChange={setInput} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div
        style={{
          maxWidth: '320px',
          padding: '10px 14px',
          borderRadius: '16px 16px 4px 16px',
          background: '#F3F4F6',
          color: '#15181D',
          fontFamily: 'Pretendard Variable',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '150%',
          letterSpacing: '-0.28px',
        }}
      >
        {content}
      </div>
    </div>
  );
}

function AIMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex flex-col gap-3">
      {message.isLoading && (
        <p style={{ color: '#94A0B4', fontFamily: 'Pretendard Variable', fontSize: '13px', fontWeight: 400 }}>
          21S 동안 생각함
        </p>
      )}
      <p
        style={{
          color: '#15181D',
          fontFamily: 'Pretendard Variable',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '160%',
          letterSpacing: '-0.28px',
          whiteSpace: 'pre-line',
        }}
      >
        {message.content}
      </p>
      {message.tags && message.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1"
              style={{ padding: '4px 10px', borderRadius: '100px', background: '#E5F3FF' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="#0085FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: '#0085FF', fontFamily: 'Pretendard Variable', fontSize: '13px', fontWeight: 500 }}>{tag}</span>
            </div>
          ))}
        </div>
      )}
      {message.referenceLinks && message.referenceLinks.length > 0 && (
        <div className="flex flex-col gap-2">
          <span style={{ color: '#94A0B4', fontFamily: 'Pretendard Variable', fontSize: '13px', fontWeight: 400 }}>참고자료</span>
          {message.referenceLinks.map((link, i) => (
            <div
              key={i}
              className="flex items-center gap-2"
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E7EAEF' }}
            >
              <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#E5F3FF', color: '#0085FF', fontSize: '12px', fontWeight: 500 }}>{link.type}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#404959', fontSize: '13px', fontWeight: 400 }}>{link.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type ChatInputProps = {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
};

function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = value.trim().length > 0;
  const showActive = isFocused || isActive;

  return (
    <div style={{ padding: '20px 24px', flexShrink: 0 }}>
      <div
        className="flex flex-col"
        style={{
          padding: '20px 24px',
          borderRadius: '16px',
          border: showActive ? '1px solid #1A91FF' : '1px solid #E7EAEF',
          background: '#F8F9FA',
          boxShadow: showActive
            ? '0 4px 12px 0 rgba(23, 146, 255, 0.16)'
            : '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
          transition: 'border 0.15s, box-shadow 0.15s',
        }}
      >
        {/* Frame 11211 — 텍스트 입력 */}
        <div style={{ minHeight: '48px', display: 'flex', alignItems: 'flex-start' }}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="원하는 나라 조건을 자유롭게 입력해보세요. 예: 유럽에서 생활비가 저렴한 도시 추천해줘"
            rows={2}
            className="w-full resize-none bg-transparent outline-none"
            style={{
              color: '#15181D',
              fontFamily: 'Pretendard Variable',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '150%',
              letterSpacing: '-0.28px',
            }}
          />
        </div>

        {/* Frame 11209 — 하단 버튼 행 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex items-center justify-center rounded transition-opacity hover:opacity-70"
            style={{ width: '24px', height: '24px' }}
            aria-label="파일 첨부"
          >
            <img src={clipIcon} alt="파일 첨부" style={{ width: '18px', height: '20px' }} />
          </button>

          <button
            type="button"
            onClick={onSend}
            disabled={!isActive}
            className="flex items-center justify-center transition-colors"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: isActive ? '#0085FF' : '#CFD3DA',
              border: 'none',
              cursor: isActive ? 'pointer' : 'default',
            }}
            aria-label="전송"
          >
            <img
              src={arrowUpIcon}
              alt="전송"
              style={{
                width: '16px',
                height: '16px',
                filter: isActive
                  ? 'none'
                  : 'brightness(0) saturate(100%) invert(70%) sepia(10%) saturate(300%) hue-rotate(180deg) brightness(95%)',
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
