import { useState } from 'react';
import clipIcon from '../../../assets/icons/icon-clip.svg';
import moreMenuIcon from '../../../assets/icons/icon-more-menu.svg';
import AIChatThread from './AIChatThread';

type AIChatPanelProps = {
  hasChat?: boolean;
  onClose?: () => void;
  onNewChat?: () => void;
  onMoreMenu?: () => void;
};

export default function AIChatPanel({ hasChat = false, onClose, onNewChat, onMoreMenu }: AIChatPanelProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const hasText = value.trim().length > 0;

  const handleSubmit = () => {
    if (!hasText) return;
    // TODO: API 연동
    setValue('');
  };

  return (
    <div
      className="relative flex flex-col"
      style={{
        width: '670px',
        height: '1080px',
        borderLeft: '1px solid #B8BFCB',
        background: '#FFF',
        flexShrink: 0,
      }}
    >
      {/* Sidebar_Collapse_Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 flex items-center"
        style={{ paddingLeft: '10px', pointerEvents: 'none' }}
      >
        <div
          style={{
            width: '6px',
            height: '120px',
            borderRadius: '10px',
            background: '#CFD3DA',
            flexShrink: 0,
          }}
        />
      </div>

      {/* R_Header_AI chat */}
      <div
        style={{
          display: 'flex',
          width: '670px',
          padding: '14px 34px 6px 30px',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E7EAEF',
          background: '#FFF',
          boxSizing: 'border-box',
        }}
      >
        {/* Frame 11243 */}
        <div
          style={{
            display: 'flex',
            width: '606px',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {/* AI Chat Title 드롭다운 버튼 */}
          <button
            type="button"
            style={{
              display: 'flex',
              width: '206px',
              height: '40px',
              padding: '8px 18px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
              borderRadius: '12px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {/* Frame 11196: 텍스트 + 화살표 */}
            <div
              style={{
                display: 'flex',
                width: '141px',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0,
                gap: '8px',
              }}
            >
              <span
                style={{
                  color: '#404959',
                  fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  lineHeight: '140%',
                  letterSpacing: '-0.36px',
                  whiteSpace: 'nowrap',
                }}
              >
                OMO 스마트 브리핑
              </span>
              {/* 20×20 chevron (아래 방향) */}
              <div
                style={{
                  display: 'flex',
                  width: '20px',
                  height: '20px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                  <path
                    d="M12.7 0.699219L6.69995 6.69922L0.699951 0.69922"
                    stroke="#6B7A94"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </button>

          {/* Frame 11200: New Chat + Collapse */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
            {/* New Chat 버튼 */}
            <button
              type="button"
              onClick={onNewChat}
              style={{
                display: 'flex',
                width: '24px',
                height: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M13.75 10.75H10.75M10.75 10.75H7.75M10.75 10.75V7.75001M10.75 10.75V13.75M5.75 2.08801C7.26945 1.20874 8.99448 0.747119 10.75 0.750014C16.273 0.750014 20.75 5.22701 20.75 10.75C20.75 16.273 16.273 20.75 10.75 20.75C5.227 20.75 0.75 16.273 0.75 10.75C0.75 8.92901 1.237 7.22001 2.088 5.75001"
                  stroke="#404959"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* More Menu(...) 버튼 — 채팅 시작 후에만 노출 */}
            {hasChat && (
              <button
                type="button"
                onClick={onMoreMenu}
                style={{
                  display: 'flex',
                  width: '24px',
                  height: '24px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <img src={moreMenuIcon} alt="더보기" width={18} height={4} />
              </button>
            )}

            {/* Collapse(>>) 버튼 */}
            <button
              type="button"
              onClick={onClose}
              style={{
                display: 'flex',
                width: '24px',
                height: '24px',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path
                  d="M6.75 14.75L12.75 7.75L6.75 0.75"
                  stroke="#404959"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0.75 14.75L6.75 7.75L0.75 0.75"
                  stroke="#404959"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        {hasChat && <AIChatThread />}
      </div>

      {/* Frame 11265: 하단 입력 영역 */}
      <div
        style={{
          display: 'flex',
          width: '670px',
          padding: '0 50px 60px 50px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          boxSizing: 'border-box',
        }}
      >
        {/* R_Prompt Input Container */}
        <div
          style={{
            display: 'flex',
            padding: '20px 24px',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'stretch',
            borderRadius: '16px',
            border: isFocused ? '1px solid #1A91FF' : '1px solid #E7EAEF',
            background: isFocused ? '#FFF' : '#F8F9FA',
            boxShadow: isFocused
              ? '0 4px 12px 0 rgba(23, 146, 255, 0.16)'
              : '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
            gap: '8px',
            transition: 'border 0.15s, box-shadow 0.15s, background 0.15s',
          }}
        >
          {/* Frame 11211: 텍스트 입력 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
              alignSelf: 'stretch',
            }}
          >
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="원하는 나라 조건을 자유롭게 입력해보세요. 예: 유럽에서 생활비가 저렴한 도시 추천해줘"
              style={{
                height: '48px',
                alignSelf: 'stretch',
                color: '#94A0B4',
                fontFamily: '"Pretendard Variable", Pretendard, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.28px',
                resize: 'none',
                outline: 'none',
                border: 'none',
                background: 'transparent',
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {/* Frame 11209: 아이콘 행 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            {/* Frame 11207: 클립 아이콘 버튼 */}
            <button
              type="button"
              style={{
                display: 'flex',
                padding: '4px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '100px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={clipIcon} alt="첨부" width={18} height={20} />
              </div>
            </button>

            {/* R_circle_icon: 전송 버튼 (텍스트 없으면 회색, 있으면 파란색) */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!hasText}
              style={{
                display: 'flex',
                width: '32px',
                height: '32px',
                padding: '6.25px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2.5px',
                borderRadius: '62.5px',
                background: hasText ? '#0085FF' : '#CFD3DA',
                border: 'none',
                cursor: hasText ? 'pointer' : 'default',
                transition: 'background 0.2s',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M6.09375 11.4062L6.09375 0.781249M11.4063 6.09375L6.09375 0.781249L0.78125 6.09375"
                  stroke="white"
                  strokeWidth="1.5625"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
