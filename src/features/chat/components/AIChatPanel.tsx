import { useState } from 'react';
import clipIcon from '../../../assets/icons/icon-clip.svg';
import imageUploadIcon from '../../../assets/icons/icon-image-upload.svg';
import clipDarkIcon from '../../../assets/icons/icon-clip-dark.svg';
import moreMenuIcon from '../../../assets/icons/icon-more-menu.svg';
import editIcon from '../../../assets/icons/icon-edit.svg';
import trashIcon from '../../../assets/icons/icon-trash.svg';
import chevronUpIcon from '../../../assets/icons/icon-chevron-up.svg';
import closeCircleGrayIcon from '../../../assets/icons/icon-close-circle-gray.svg';
import closeCircleWhiteIcon from '../../../assets/icons/icon-close-circle-white.svg';
import alertRedIcon from '../../../assets/icons/icon-alert-red.svg';
import fileErrorIcon from '../../../assets/icons/icon-file-error.svg';
import clockTealIcon from '../../../assets/icons/icon-clock-teal.svg';
import AIChatThread from './AIChatThread';

const MOCK_HISTORY = [
  { id: 1, title: '독일 어학연수' },
  { id: 2, title: '독일 교환학생 비용' },
  { id: 3, title: '독일 숙소비' },
];

const MOCK_IMAGES = [
  { id: '1', isDark: false },
  { id: '2', isDark: false },
  { id: '3', isDark: false },
  { id: '4', isDark: true },
];

type NoticeType = 'attachment' | 'briefing-error' | 'file-error' | 'timeout' | null;

type AIChatPanelProps = {
  hasChat?: boolean;
  onClose?: () => void;
  onNewChat?: () => void;
  defaultNotice?: NoticeType;
};

export default function AIChatPanel({ hasChat = false, onClose, onNewChat, defaultNotice = null }: AIChatPanelProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNewChatHovered, setIsNewChatHovered] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [noticeType, setNoticeType] = useState<NoticeType>(defaultNotice);
  const [isDragOver, setIsDragOver] = useState(false);

  const hasText = value.trim().length > 0;
  const hasImages = noticeType === 'attachment';

  const handleSubmit = () => {
    if (!hasText) return;
    setValue('');
  };

  const handleClipClick = () => {
    setNoticeType((prev) => (prev === 'attachment' ? null : 'attachment'));
  };

  const renderNoticeBar = () => {
    if (!noticeType) return null;

    type BarConfig = {
      border: string;
      background: string;
      icon: string;
      iconW: number;
      iconH: number;
      mainText: string;
      mainColor: string;
      subText?: string;
      subColor?: string;
    };

    const configs: Record<NonNullable<NoticeType>, BarConfig> = {
      attachment: {
        border: '1px solid var(--color-gray-100)',
        background: 'var(--color-white)',
        icon: clipDarkIcon,
        iconW: 18,
        iconH: 20,
        mainText: '사진 및 파일 첨부',
        mainColor: 'var(--color-gray-900)',
        subText: '컴퓨터에서 업로드하세요   JPG, PNG, PDF · 파일당 최대 10MB',
        subColor: 'var(--color-gray-400)',
      },
      'briefing-error': {
        border: '1px solid var(--color-red-100)',
        background: 'var(--color-red-50)',
        icon: alertRedIcon,
        iconW: 20,
        iconH: 20,
        mainText: '브리핑 답변을 생성하지 못했어요.',
        mainColor: 'var(--color-red-600)',
        subText: '잠시 후 다시 시도해 주세요.',
        subColor: 'var(--color-red-300)',
      },
      'file-error': {
        border: '1px solid var(--color-red-100)',
        background: 'var(--color-red-50)',
        icon: fileErrorIcon,
        iconW: 24,
        iconH: 24,
        mainText: '파일을 업로드 하지 못했어요.',
        mainColor: 'var(--color-red-600)',
        subText: '파일 형식이나 용량을 확인한 뒤 다시 시도해 주세요.',
        subColor: 'var(--color-red-300)',
      },
      timeout: {
        border: '1px solid var(--color-secondary-100)',
        background: 'var(--color-secondary-50)',
        icon: clockTealIcon,
        iconW: 24,
        iconH: 24,
        mainText: '응답이 지연되고 있어요. 다시 시도 해주세요.',
        mainColor: 'var(--color-secondary-700)',
      },
    };

    const cfg = configs[noticeType];

    return (
      <div
        style={{
          position: 'absolute',
          top: '-48px',
          left: '0',
          right: '0',
          display: 'flex',
          width: '570px',
          padding: '6px 20px',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '12px',
          border: cfg.border,
          background: cfg.background,
          boxShadow: '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
          boxSizing: 'border-box',
        }}
      >
        {/* 아이콘 */}
        <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <img src={cfg.icon} alt="" width={cfg.iconW} height={cfg.iconH} />
        </div>
        {/* 텍스트 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              className="body-04"
              style={{ color: cfg.mainColor }}
            >
              {cfg.mainText}
            </span>
            {cfg.subText && (
              <span
                className="label-01"
                style={{ color: cfg.subColor }}
              >
                {cfg.subText}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex flex-col"
      style={{ width: '670px', height: '1080px', borderLeft: '1px solid var(--color-gray-300)', background: 'var(--color-white)', flexShrink: 0 }}
      onClick={() => {
        if (isDropdownOpen) setIsDropdownOpen(false);
        if (isMoreMenuOpen) setIsMoreMenuOpen(false);
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
    >
      {/* Sidebar_Collapse_Handle */}
      <div className="absolute left-0 top-0 bottom-0 flex items-center" style={{ paddingLeft: '10px', pointerEvents: 'none' }}>
        <div style={{ width: '6px', height: '120px', borderRadius: '10px', background: 'var(--color-gray-200)', flexShrink: 0 }} />
      </div>

      {/* Image Upload Dropzone 오버레이 */}
      {isDragOver && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '30px 40px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.40)',
            }}
          >
            {/* 32×32 아이콘 */}
            <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={imageUploadIcon} alt="업로드" width={24} height={24} />
              </div>
            </div>
            <span
              style={{
                alignSelf: 'stretch',
                color: 'var(--color-gray-700)',
                textAlign: 'center',
                fontFamily: 'var(--font-pretendard)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '140%',
                letterSpacing: '-0.32px',
              }}
            >
              이미지 또는 파일을 여기에 놓아주세요.
            </span>
            <span
              className="label-01"
              style={{ color: 'var(--color-gray-600)' }}
            >
              JPG, PNG 파일을 첨부할 수 있어요. 파일당 최대 10MB
            </span>
          </div>
        </div>
      )}

      {/* R_Header_AI chat */}
      <div
        style={{
          display: 'flex',
          width: '670px',
          padding: '14px 34px 6px 30px',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-gray-100)',
          background: 'var(--color-white)',
          boxSizing: 'border-box',
        }}
      >
        {/* Frame 11243 */}
        <div style={{ display: 'flex', width: '606px', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>

          {/* AI Chat Title 드롭다운 버튼 */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setIsDropdownOpen((v) => !v); }}
              onMouseEnter={() => setIsTitleHovered(true)}
              onMouseLeave={() => setIsTitleHovered(false)}
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
                background: isTitleHovered || isDropdownOpen ? 'var(--color-gray-20)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ display: 'flex', width: '141px', justifyContent: 'center', alignItems: 'center', flexShrink: 0, gap: '8px' }}>
                <span className="title-01" style={{ color: 'var(--color-gray-700)', whiteSpace: 'nowrap' }}>
                  OMO 스마트 브리핑
                </span>
                <div style={{ display: 'flex', width: '20px', height: '20px', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  {isDropdownOpen
                    ? <img src={chevronUpIcon} alt="닫기" width={14} height={8} />
                    : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                        <path d="M12.7 0.699219L6.69995 6.69922L0.699951 0.69922" stroke="var(--color-gray-500)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )
                  }
                </div>
              </div>
            </button>

            {/* Chat History Dropdown */}
            {isDropdownOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  right: '-68px',
                  bottom: '-164px',
                  width: '274px',
                  padding: '10px 12px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  display: 'flex',
                  borderRadius: '16px',
                  border: '1px solid var(--color-gray-200)',
                  background: 'var(--color-white)',
                  boxShadow: '4px 8px 16px 0 rgba(6, 49, 88, 0.20)',
                  zIndex: 50,
                }}
              >
                <div style={{ display: 'flex', padding: '8px 20px', alignItems: 'center', gap: '4px', alignSelf: 'stretch' }}>
                  <span className="body-05" style={{ color: 'var(--color-gray-600)' }}>
                    지난 30일
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'stretch' }}>
                  {MOCK_HISTORY.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      style={{
                        display: 'flex',
                        padding: '8px 20px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '4px',
                        alignSelf: 'stretch',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-gray-20)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    >
                      <span className="body-02" style={{
                        display: '-webkit-box',
                        width: '210px',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        overflow: 'hidden',
                        color: 'var(--color-gray-800)',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Frame 11200: New Chat + More Menu + Collapse */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>

            {/* New Chat 버튼 */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={onNewChat}
                onMouseEnter={() => setIsNewChatHovered(true)}
                onMouseLeave={() => setIsNewChatHovered(false)}
                style={{ display: 'flex', width: '24px', height: '24px', justifyContent: 'center', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M13.75 10.75H10.75M10.75 10.75H7.75M10.75 10.75V7.75001M10.75 10.75V13.75M5.75 2.08801C7.26945 1.20874 8.99448 0.747119 10.75 0.750014C16.273 0.750014 20.75 5.22701 20.75 10.75C20.75 16.273 16.273 20.75 10.75 20.75C5.227 20.75 0.75 16.273 0.75 10.75C0.75 8.92901 1.237 7.22001 2.088 5.75001" stroke="var(--color-gray-700)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              {isNewChatHovered && (
                <div style={{
                  position: 'absolute',
                  right: '-29px',
                  bottom: '-29px',
                  display: 'flex',
                  height: '25px',
                  padding: '4px 12px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '6px',
                  background: 'var(--color-gray-50)',
                  whiteSpace: 'nowrap',
                  zIndex: 50,
                }}>
                  <span className="body-05" style={{ color: 'var(--color-gray-600)' }}>
                    새 채팅 시작
                  </span>
                </div>
              )}
            </div>

            {/* More Menu(...) 버튼 — 채팅 시작 후에만 노출 */}
            {hasChat && (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsMoreMenuOpen((v) => !v); }}
                  style={{ display: 'flex', width: '24px', height: '24px', justifyContent: 'center', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <img src={moreMenuIcon} alt="더보기" width={18} height={4} />
                </button>
                {isMoreMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      right: '-52px',
                      bottom: '-76px',
                      width: '124px',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '4px',
                      borderRadius: '12px',
                      background: 'var(--color-gray-50)',
                      boxShadow: '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
                      zIndex: 50,
                    }}
                  >
                    <div style={{ display: 'flex', width: '108px', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                      <button
                        type="button"
                        style={{ display: 'flex', height: '26px', padding: '4px 12px', alignItems: 'center', gap: '4px', alignSelf: 'stretch', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-gray-100)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <img src={editIcon} alt="수정" width={16} height={16} />
                        <span className="body-05" style={{ color: 'var(--color-gray-600)' }}>
                          이름 수정하기
                        </span>
                      </button>
                      <button
                        type="button"
                        style={{ display: 'flex', height: '26px', padding: '4px 12px', alignItems: 'center', gap: '4px', alignSelf: 'stretch', borderRadius: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-gray-100)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <img src={trashIcon} alt="삭제" width={16} height={16} />
                        <span className="body-05" style={{ color: 'var(--color-gray-600)' }}>
                          삭제하기
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Collapse(>>) 버튼 */}
            <button
              type="button"
              onClick={onClose}
              style={{ display: 'flex', width: '24px', height: '24px', justifyContent: 'center', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M6.75 14.75L12.75 7.75L6.75 0.75" stroke="var(--color-gray-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0.75 14.75L6.75 7.75L0.75 0.75" stroke="var(--color-gray-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto">
        {hasChat && <AIChatThread />}
      </div>

      {/* Frame 11265: 하단 입력 영역 (그라데이션 + 입력창) */}
      <div
        style={{
          display: 'flex',
          width: '670px',
          padding: '0 50px 60px 50px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px',
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, var(--color-white) 19.71%)',
        }}
      >
        {/* R_Prompt Input Container 래퍼 (notice bar position 기준) */}
        <div style={{ position: 'relative', alignSelf: 'stretch' }}>
          {renderNoticeBar()}

          {/* R_Prompt Input Container */}
          <div
            style={{
              display: 'flex',
              padding: hasImages ? '16px 24px 20px 24px' : '20px 24px',
              flexDirection: 'column',
              alignItems: 'center',
              alignSelf: 'stretch',
              borderRadius: '16px',
              border: isFocused ? '1px solid var(--color-primary-400)' : '1px solid var(--color-gray-100)',
              background: isFocused ? 'var(--color-white)' : 'var(--color-gray-20)',
              boxShadow: isFocused ? '0 4px 12px 0 rgba(23, 146, 255, 0.16)' : '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
              gap: '8px',
              transition: 'border 0.15s, box-shadow 0.15s, background 0.15s',
            }}
          >
            {/* Frame 11211: 이미지(있을 경우) + 텍스트 입력 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: hasImages ? '16px' : '8px', alignSelf: 'stretch' }}>

              {/* Frame 11457: 이미지 썸네일 행 (이미지 있을때만) */}
              {hasImages && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  {MOCK_IMAGES.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        position: 'relative',
                        width: '100px',
                        height: '124px',
                        borderRadius: '12px',
                        border: `1px solid ${img.isDark ? 'var(--color-gray-500)' : 'var(--color-gray-200)'}`,
                        background: img.isDark ? 'var(--color-gray-400)' : 'var(--color-gray-100)',
                        flexShrink: 0,
                      }}
                    >
                      {/* Frame 11452: 닫기 버튼 오버레이 */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          width: '100px',
                          padding: '8px 8px 0 0',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-start',
                          boxSizing: 'border-box',
                        }}
                      >
                        <button
                          type="button"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, width: '20px', height: '20px' }}
                        >
                          <img
                            src={img.isDark ? closeCircleWhiteIcon : closeCircleGrayIcon}
                            alt="삭제"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Frame 11458: 텍스트 입력 */}
              <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="원하는 나라 조건을 자유롭게 입력해보세요. 예: 유럽에서 생활비가 저렴한 도시 추천해줘"
                style={{
                  height: '48px',
                  alignSelf: 'stretch',
                  color: 'var(--color-gray-400)',
                  fontFamily: 'var(--font-pretendard)',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' }}>
              {/* 클립 아이콘 버튼 */}
              <button
                type="button"
                onClick={handleClipClick}
                style={{
                  display: 'flex',
                  padding: '4px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '100px',
                  background: noticeType === 'attachment' ? 'var(--color-gray-100)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={clipIcon} alt="첨부" width={18} height={20} />
                </div>
              </button>

              {/* 전송 버튼 */}
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
                  borderRadius: '62.5px',
                  background: hasText ? 'var(--color-primary-500)' : 'var(--color-gray-200)',
                  border: 'none',
                  cursor: hasText ? 'pointer' : 'default',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M6.09375 11.4062L6.09375 0.781249M11.4063 6.09375L6.09375 0.781249L0.78125 6.09375" stroke="white" strokeWidth="1.5625" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
