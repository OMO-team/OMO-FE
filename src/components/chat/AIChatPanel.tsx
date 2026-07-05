import { useState } from 'react';

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
    <div
      className="flex flex-col bg-white"
      style={{ width: '551px', height: '100vh', borderLeft: '1px solid #E7EAEF' }}
    >
      {/* 헤더 */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{ padding: '16px 20px', borderBottom: '1px solid #E7EAEF' }}
      >
        <button type="button" className="flex items-center gap-1">
          <span style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '16px', fontWeight: 600, lineHeight: '140%', letterSpacing: '-0.32px' }}>
            OMO 스마트 브리핑
          </span>
          {/* 드롭다운 화살표 */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="#15181D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          {/* 새 채팅 */}
          <button type="button" className="flex justify-center items-center" style={{ width: '24px', height: '24px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10.5" stroke="#94A0B4" strokeWidth="1" />
              <path d="M12 7.5V16.5M7.5 12H16.5" stroke="#94A0B4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {/* 더보기 (기본 상태엔 숨김, 채팅 시작 후 표시) */}
          {!isEmpty && (
            <button type="button" className="flex justify-center items-center" style={{ width: '24px', height: '24px' }}>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="1.5" fill="#94A0B4" />
                <circle cx="8" cy="2" r="1.5" fill="#94A0B4" />
                <circle cx="14" cy="2" r="1.5" fill="#94A0B4" />
              </svg>
            </button>
          )}
          {/* 접기 */}
          <button type="button" onClick={onClose} className="flex justify-center items-center" style={{ width: '24px', height: '24px' }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1H15M1 6H15M1 11H15" stroke="#94A0B4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '24px 20px' }}>
        {isEmpty ? (
          /* Empty State */
          <div className="flex flex-col items-start gap-6">
            {/* 여행 가방 아이콘 + 타이틀 */}
            <div className="flex flex-col items-start gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="24" height="18" rx="3" stroke="#0085FF" strokeWidth="2" />
                <path d="M11 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" stroke="#0085FF" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 18h24" stroke="#0085FF" strokeWidth="2" />
              </svg>
              <p style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '22px', fontWeight: 700, lineHeight: '140%', letterSpacing: '-0.66px' }}>
                어느 나라로 떠나고 싶으신가요?
              </p>
              <p style={{ color: '#566276', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 400, lineHeight: '150%', letterSpacing: '-0.28px' }}>
                원하는 조건이나 예산을 자유롭게 적으면, OMO AI가 딱 맞는 도시를 찾아드릴게요.
              </p>
            </div>

            {/* 추천 프롬프트 */}
            <div className="flex flex-col items-start gap-2 self-stretch">
              {['치안이 좋고 영어로 생활 가능한 200만원 이하 도시', '유럽에서 생활비가 저렴하고 대중교통 좋은 곳', '아시아 워킹홀리데이 추천, 한 달 150만원 예산'].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="flex items-center self-stretch text-left"
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #E7EAEF', background: '#FFF' }}
                >
                  <span style={{ color: '#404959', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 400, lineHeight: '150%', letterSpacing: '-0.28px' }}>
                    {prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* 채팅 메시지 목록 */
          <div className="flex flex-col gap-6">
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

      {/* 입력창 */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
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
      {message.isLoading ? (
        <p style={{ color: '#94A0B4', fontFamily: 'Pretendard Variable', fontSize: '13px', fontWeight: 400 }}>
          21S 동안 생각함
        </p>
      ) : null}
      <p style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 400, lineHeight: '160%', letterSpacing: '-0.28px', whiteSpace: 'pre-line' }}>
        {message.content}
      </p>
      {message.tags && message.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.tags.map((tag) => (
            <div key={tag} className="flex items-center gap-1" style={{ padding: '4px 10px', borderRadius: '100px', background: '#E5F3FF' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#0085FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ color: '#0085FF', fontFamily: 'Pretendard Variable', fontSize: '13px', fontWeight: 500, lineHeight: '140%' }}>{tag}</span>
            </div>
          ))}
        </div>
      )}
      {message.referenceLinks && message.referenceLinks.length > 0 && (
        <div className="flex flex-col gap-2">
          <span style={{ color: '#94A0B4', fontFamily: 'Pretendard Variable', fontSize: '13px', fontWeight: 400 }}>참고자료</span>
          {message.referenceLinks.map((link, i) => (
            <div key={i} className="flex items-center gap-2" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E7EAEF' }}>
              <span style={{ padding: '2px 6px', borderRadius: '4px', background: '#E5F3FF', color: '#0085FF', fontSize: '12px', fontWeight: 500 }}>{link.type}</span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#404959', fontSize: '13px', fontWeight: 400 }}>{link.title}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-2M9 3h4m0 0v4m0-4L8 10" stroke="#94A0B4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
  const isActive = value.trim().length > 0;

  return (
    <div
      className="flex-shrink-0"
      style={{
        margin: '0 20px 20px',
        padding: '12px 14px',
        borderRadius: '12px',
        border: isActive ? '1px solid #0085FF' : '1px solid #E7EAEF',
        background: '#FFF',
        transition: 'border 0.15s',
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder="원하는 나라 조건을 자유롭게 입력해보세요. 예: 유럽에서 생활비가 저렴한 도시 추천해줘"
        rows={1}
        className="w-full outline-none resize-none bg-transparent"
        style={{ color: '#15181D', fontFamily: 'Pretendard Variable', fontSize: '14px', fontWeight: 400, lineHeight: '150%', letterSpacing: '-0.28px' }}
      />
      <div className="flex justify-between items-center mt-2">
        {/* 파일 첨부 */}
        <button type="button" className="flex justify-center items-center" style={{ width: '24px', height: '24px' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 9.5l-7.5 7.5A5 5 0 0 1 2.5 10l7-7a3.333 3.333 0 0 1 4.714 4.714L7 15a1.667 1.667 0 0 1-2.357-2.357L11 6.5" stroke="#B8BFCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* 전송 */}
        <button
          type="button"
          onClick={onSend}
          disabled={!isActive}
          className="flex justify-center items-center"
          style={{ width: '32px', height: '32px', borderRadius: '50%', background: isActive ? '#0085FF' : '#E7EAEF', transition: 'background 0.15s' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 13V3M3 8l5-5 5 5" stroke={isActive ? '#FFF' : '#B8BFCB'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
