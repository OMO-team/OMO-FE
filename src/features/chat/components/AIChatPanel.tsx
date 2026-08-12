import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import suitcaseIcon from '../../../assets/icons/icon-suitcase[32].svg';
import imageUploadIcon from '../../../assets/icons/icon-image-upload.svg';
import moreMenuIcon from '../../../assets/icons/icon-more-menu.svg';
import editIcon from '../../../assets/icons/icon-edit.svg';
import trashIcon from '../../../assets/icons/icon-trash.svg';
import chevronUpIcon from '../../../assets/icons/icon-chevron-up.svg';
import alertRedIcon from '../../../assets/icons/icon-alert-red.svg';
import fileErrorIcon from '../../../assets/icons/icon-file-error.svg';
import clockTealIcon from '../../../assets/icons/icon-clock-teal.svg';
import AIChatThread from './AIChatThread';
import { chatApi } from '../api/chatApi';
import type { BriefingData, ChipInfo } from '../types/dto';

type ChatEntry = {
  id: string;
  userMessage: string;
  thinkingTime: number;
  briefingData: BriefingData | null;
  status: 'loading' | 'completed' | 'empty' | 'cancelled' | 'error';
};

const POLL_INTERVAL_MS = 2000;
const TIMEOUT_MS = 60000;

const MIN_PANEL_WIDTH = 40;
const MAX_PANEL_WIDTH = 1000;
const DEFAULT_PANEL_WIDTH = 670;
const PANEL_COMPACT_THRESHOLD = 60;
const HEADER_ICONS_MIN_WIDTH = 190;

type NoticeType = 'briefing-error' | 'file-error' | 'timeout' | null;

type AIChatPanelProps = {
  onClose?: () => void;
  onNewChat?: () => void;
  defaultNotice?: NoticeType;
  initialMessage?: string;
};

type BarConfig = {
  borderClass: string;
  bgClass: string;
  icon: string;
  iconW: number;
  iconH: number;
  mainText: string;
  mainColorClass: string;
  subText?: string;
  subColorClass?: string;
};

const NOTICE_CONFIGS: Record<NonNullable<NoticeType>, BarConfig> = {
  'briefing-error': {
    borderClass: 'border border-red-100',
    bgClass: 'bg-red-50',
    icon: alertRedIcon,
    iconW: 20,
    iconH: 20,
    mainText: '브리핑 답변을 생성하지 못했어요.',
    mainColorClass: 'text-red-600',
    subText: '잠시 후 다시 시도해 주세요.',
    subColorClass: 'text-red-300',
  },
  'file-error': {
    borderClass: 'border border-red-100',
    bgClass: 'bg-red-50',
    icon: fileErrorIcon,
    iconW: 24,
    iconH: 24,
    mainText: '파일을 업로드 하지 못했어요.',
    mainColorClass: 'text-red-600',
    subText: '파일 형식이나 용량을 확인한 뒤 다시 시도해 주세요.',
    subColorClass: 'text-red-300',
  },
  timeout: {
    borderClass: 'border border-secondary-100',
    bgClass: 'bg-secondary-50',
    icon: clockTealIcon,
    iconW: 24,
    iconH: 24,
    mainText: '응답이 지연되고 있어요. 다시 시도 해주세요.',
    mainColorClass: 'text-secondary-700',
  },
};

export default function AIChatPanel({
  onClose,
  onNewChat,
  defaultNotice = null,
  initialMessage,
}: AIChatPanelProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNewChatHovered, setIsNewChatHovered] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [noticeType, setNoticeType] = useState<NoticeType>(defaultNotice);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const [chips, setChips] = useState<ChipInfo[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollStartTimeRef = useRef<number>(0);
  const currentEntryIdRef = useRef<string | null>(null);
  const initialSubmittedRef = useRef(false);

  const hasChatStarted = chatHistory.length > 0;

  const handleResizeMove = useCallback((e: MouseEvent) => {
    const state = resizeRef.current;
    if (!state) return;
    const delta = state.startX - e.clientX;
    const nextWidth = Math.min(
      MAX_PANEL_WIDTH,
      Math.max(MIN_PANEL_WIDTH, state.startWidth + delta)
    );
    setPanelWidth(nextWidth);
  }, []);

  const handleResizeEnd = useCallback(() => {
    resizeRef.current = null;
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', handleResizeMove);
  }, [handleResizeMove]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startWidth: panelWidth };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    (taskId: string) => {
      pollStartTimeRef.current = Date.now();

      const poll = async () => {
        if (!pollTimerRef.current) return;

        if (Date.now() - pollStartTimeRef.current > TIMEOUT_MS) {
          stopPolling();
          setIsStreaming(false);
          setNoticeType('timeout');
          return;
        }

        try {
          const result = await chatApi.getBriefingStatus(taskId);

          if (!pollTimerRef.current) return; // await 후 stale 체크

          if (result.status === 'COMPLETED') {
            stopPolling();
            setIsStreaming(false);
            const entryId = currentEntryIdRef.current;
            if (result.briefingData) {
              setChatHistory(prev =>
                prev.map(e =>
                  e.id === entryId
                    ? {
                        ...e,
                        briefingData: result.briefingData,
                        thinkingTime: result.briefingData!.thinkingTime,
                        status: 'completed',
                      }
                    : e
                )
              );
            } else {
              setChatHistory(prev =>
                prev.map(e => (e.id === entryId ? { ...e, status: 'empty' } : e))
              );
            }
          } else if (result.status === 'FAILED') {
            stopPolling();
            setIsStreaming(false);
            setNoticeType('briefing-error');
          } else {
            pollTimerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
          }
        } catch (error) {
          if (!pollTimerRef.current) return;
          stopPolling();
          setIsStreaming(false);
          if (
            axios.isAxiosError<{ code?: string }>(error) &&
            error.response?.data?.code === 'AI-005'
          ) {
            setSessionId(null);
          }
          const entryId = currentEntryIdRef.current;
          if (entryId) {
            setChatHistory(prev =>
              prev.map(e =>
                e.id === entryId && e.status === 'loading' ? { ...e, status: 'error' } : e
              )
            );
          }
          setNoticeType('briefing-error');
        }
      };

      pollTimerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const submitQuery = useCallback(
    async (query: string, currentSessionId: number | null) => {
      const entryId = Date.now().toString();
      currentEntryIdRef.current = entryId;
      setChatHistory(prev => [
        ...prev,
        { id: entryId, userMessage: query, thinkingTime: 0, briefingData: null, status: 'loading' },
      ]);
      setIsStreaming(true);
      setNoticeType(null);
      try {
        const { sessionId: newSessionId, taskId } = await chatApi.startBriefing({
          searchQuery: query,
          isRefine: currentSessionId !== null,
          sessionId: currentSessionId,
        });
        setSessionId(newSessionId);
        startPolling(taskId);
      } catch (error) {
        setIsStreaming(false);
        if (axios.isAxiosError<{ code?: string }>(error)) {
          const code = error.response?.data?.code;
          if (code === 'AI400_2' || code === 'VALID400_1') {
            setSessionId(null);
          }
        }
        setChatHistory(prev =>
          prev.map(e =>
            e.id === entryId && e.status === 'loading' ? { ...e, status: 'error' } : e
          )
        );
        setNoticeType('briefing-error');
      }
    },
    [startPolling]
  );

  useEffect(() => {
    chatApi
      .getRecommendChips()
      .then(setChips)
      .catch(() => {});
    return () => stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    const query = initialMessage?.trim();
    if (!query || initialSubmittedRef.current) return;
    initialSubmittedRef.current = true;
    submitQuery(query, null);
    // 마운트 시 한 번만 실행 (StrictMode 이중 실행 방지)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasText = value.trim().length > 0;

  const handleSubmit = async () => {
    if (!hasText || isStreaming) return;
    const query = value.trim();
    setValue('');
    await submitQuery(query, sessionId);
  };

  const handleStop = () => {
    stopPolling();
    setIsStreaming(false);
    const entryId = currentEntryIdRef.current;
    if (entryId) {
      setChatHistory(prev =>
        prev.map(e =>
          e.id === entryId && e.status === 'loading' ? { ...e, status: 'cancelled' } : e
        )
      );
    }
  };

  const handleNewChat = async () => {
    stopPolling();
    setIsStreaming(false);
    setChatHistory([]);
    setNoticeType(null);
    if (sessionId !== null) {
      chatApi.deleteSession(sessionId).catch((error: unknown) => {
        if (
          axios.isAxiosError<{ code?: string }>(error) &&
          error.response?.data?.code === 'AI-002'
        ) {
          return;
        }
        setNoticeType('briefing-error');
      });
      setSessionId(null);
    }
    onNewChat?.();
  };

  const renderNoticeBar = () => {
    if (!noticeType) return null;
    const cfg = NOTICE_CONFIGS[noticeType];

    return (
      <div
        className={`${cfg.bgClass} ${cfg.borderClass} absolute flex items-center gap-2`}
        style={{
          top: '-48px',
          left: '0',
          right: '0',
          padding: '6px 20px',
          borderRadius: '12px',
          boxShadow: '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
          boxSizing: 'border-box',
        }}
      >
        <div className="size-icon-md flex items-center justify-center flex-shrink-0">
          <img src={cfg.icon} alt="" width={cfg.iconW} height={cfg.iconH} />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`body-04 ${cfg.mainColorClass}`}>{cfg.mainText}</span>
            {cfg.subText && <span className={`label-01 ${cfg.subColorClass}`}>{cfg.subText}</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex h-full flex-col border-l border-gray-100 bg-white"
      style={{
        width: `${panelWidth}px`,
        minWidth: `${MIN_PANEL_WIDTH}px`,
        maxWidth: `${MAX_PANEL_WIDTH}px`,
        flexShrink: 0,
      }}
      onClick={() => {
        if (isDropdownOpen) setIsDropdownOpen(false);
        if (isMoreMenuOpen) setIsMoreMenuOpen(false);
      }}
      onDragOver={e => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={e => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragOver(false);
      }}
      onDrop={e => {
        e.preventDefault();
        setIsDragOver(false);
      }}
    >
      {/* Sidebar_Collapse_Handle — 왼쪽 중앙에서 드래그해 채팅창 너비 조절 (Figma node 855:22882) */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="채팅창 크기 조절"
        onMouseDown={handleResizeStart}
        className="absolute left-[-1px] top-0 flex h-full items-center pl-[10px] cursor-col-resize"
        style={{ zIndex: 20 }}
      >
        <div
          className="bg-gray-200 shrink-0 rounded-[10px]"
          style={{ width: '6px', height: '120px' }}
        />
      </div>

      {/* Image Upload Dropzone 오버레이 */}
      {isDragOver && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/50"
          style={{ zIndex: 100 }}
        >
          <div
            className="inline-flex flex-col items-center justify-center gap-3 rounded-5"
            style={{ padding: '30px 40px', background: 'rgba(255, 255, 255, 0.40)' }}
          >
            <div className="size-icon-xl flex items-center justify-center">
              <img src={imageUploadIcon} alt="업로드" width={24} height={24} />
            </div>
            <span
              className="text-gray-700 text-center"
              style={{
                alignSelf: 'stretch',
                fontFamily: 'var(--font-pretendard)',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '140%',
                letterSpacing: '-0.32px',
              }}
            >
              이미지 또는 파일을 여기에 놓아주세요.
            </span>
            <span className="label-01 text-gray-600">
              JPG, PNG 파일을 첨부할 수 있어요. 파일당 최대 10MB
            </span>
          </div>
        </div>
      )}

      {/* R_Header_AI chat */}
      <div
        className="flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0"
        style={{
          width: '100%',
          height: '61px',
          padding: '14px 34px 6px 30px',
          boxSizing: 'border-box',
        }}
      >
        <div className="flex items-center flex-shrink-0" style={{ width: '100%' }}>
          {/* AI Chat Title 드롭다운 버튼 — 겹칠 만큼 좁아지면 숨김 */}
          {panelWidth >= PANEL_COMPACT_THRESHOLD && (
            <div className="relative" style={{ minWidth: 0 }}>
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setIsDropdownOpen(v => !v);
                }}
                onMouseEnter={() => setIsTitleHovered(true)}
                onMouseLeave={() => setIsTitleHovered(false)}
                className={`flex items-center justify-center gap-2 rounded-3 border-none cursor-pointer transition-colors ${isTitleHovered || isDropdownOpen ? 'bg-gray-20' : 'bg-transparent'}`}
                style={{
                  width: '100%',
                  maxWidth: '206px',
                  minWidth: 0,
                  height: '40px',
                  padding: '8px 18px',
                  boxSizing: 'border-box',
                }}
              >
                <div className="flex items-center justify-center gap-2" style={{ minWidth: 0 }}>
                  <span className="title-01 text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                    OMO 스마트 브리핑
                  </span>
                  <div className="size-icon-sm flex items-center justify-center flex-shrink-0">
                    {isDropdownOpen ? (
                      <img src={chevronUpIcon} alt="닫기" width={14} height={8} />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                      >
                        <path
                          d="M12.7 0.699219L6.69995 6.69922L0.699951 0.69922"
                          stroke="var(--color-gray-500)"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>

              {/* Chat History Dropdown */}
              {isDropdownOpen && (
                <div
                  className="absolute flex flex-col items-start border border-gray-200 bg-white rounded-4"
                  onClick={e => e.stopPropagation()}
                  style={{
                    right: '-68px',
                    bottom: '-164px',
                    width: '274px',
                    padding: '10px 12px',
                    boxShadow: '4px 8px 16px 0 rgba(6, 49, 88, 0.20)',
                    zIndex: 50,
                  }}
                >
                  <div
                    className="flex items-center gap-1"
                    style={{ padding: '8px 20px', alignSelf: 'stretch' }}
                  >
                    <span className="body-05 text-gray-600">지난 30일</span>
                  </div>
                  <div className="flex flex-col items-start" style={{ alignSelf: 'stretch' }}>
                    {/* 세션 히스토리 API 미구현 — 추후 연동 */}
                    {[].map((item: { id: number; title: string }) => (
                      <button
                        key={item.id}
                        type="button"
                        className="flex items-center justify-center gap-1 rounded-2 border-none cursor-pointer text-left hover:bg-gray-20 bg-transparent transition-colors"
                        style={{ padding: '8px 20px', alignSelf: 'stretch' }}
                      >
                        <span
                          className="body-02 text-gray-800"
                          style={{
                            display: '-webkit-box',
                            width: '210px',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Frame 11200: New Chat + More Menu + Collapse — ml-auto로 항상 오른쪽 끝에 고정 (제목이 사라져도 위치 유지), 더 좁아지면 잘려 보이니 숨김 */}
          {panelWidth >= HEADER_ICONS_MIN_WIDTH && (
            <div className="flex items-center justify-end gap-3 flex-shrink-0 ml-auto">
              {/* New Chat 버튼 */}
              <div className="relative">
                <button
                  type="button"
                  onClick={handleNewChat}
                  onMouseEnter={() => setIsNewChatHovered(true)}
                  onMouseLeave={() => setIsNewChatHovered(false)}
                  className="size-icon-md flex items-center justify-center bg-transparent border-none cursor-pointer p-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M13.75 10.75H10.75M10.75 10.75H7.75M10.75 10.75V7.75001M10.75 10.75V13.75M5.75 2.08801C7.26945 1.20874 8.99448 0.747119 10.75 0.750014C16.273 0.750014 20.75 5.22701 20.75 10.75C20.75 16.273 16.273 20.75 10.75 20.75C5.227 20.75 0.75 16.273 0.75 10.75C0.75 8.92901 1.237 7.22001 2.088 5.75001"
                      stroke="var(--color-gray-700)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                {isNewChatHovered && (
                  <div
                    className="absolute flex items-center justify-center gap-1 rounded-2 bg-gray-50 whitespace-nowrap"
                    style={{
                      right: '-29px',
                      bottom: '-29px',
                      height: '25px',
                      padding: '4px 12px',
                      zIndex: 50,
                    }}
                  >
                    <span className="body-05 text-gray-600">새 채팅 시작</span>
                  </div>
                )}
              </div>

              {/* More Menu(...) 버튼 — 채팅 시작 후에만 노출 */}
              {hasChatStarted && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setIsMoreMenuOpen(v => !v);
                    }}
                    className="size-icon-md flex items-center justify-center bg-transparent border-none cursor-pointer p-0"
                  >
                    <img src={moreMenuIcon} alt="더보기" width={18} height={4} />
                  </button>
                  {isMoreMenuOpen && (
                    <div
                      className="absolute flex flex-col items-start gap-1 rounded-3 bg-gray-50"
                      onClick={e => e.stopPropagation()}
                      style={{
                        right: '-52px',
                        bottom: '-76px',
                        width: '124px',
                        padding: '8px',
                        boxShadow: '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
                        zIndex: 50,
                      }}
                    >
                      <div className="flex flex-col items-start gap-1" style={{ width: '108px' }}>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-2 border-none cursor-pointer bg-transparent hover:bg-gray-100 transition-colors"
                          style={{ height: '26px', padding: '4px 12px', alignSelf: 'stretch' }}
                        >
                          <img src={editIcon} alt="수정" width={16} height={16} />
                          <span className="body-05 text-gray-600">이름 수정하기</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 rounded-2 border-none cursor-pointer bg-transparent hover:bg-gray-100 transition-colors"
                          style={{ height: '26px', padding: '4px 12px', alignSelf: 'stretch' }}
                        >
                          <img src={trashIcon} alt="삭제" width={16} height={16} />
                          <span className="body-05 text-gray-600">삭제하기</span>
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
                className="size-icon-md flex items-center justify-center bg-transparent border-none cursor-pointer p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="16"
                  viewBox="0 0 14 16"
                  fill="none"
                >
                  <path
                    d="M6.75 14.75L12.75 7.75L6.75 0.75"
                    stroke="var(--color-gray-700)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M0.75 14.75L6.75 7.75L0.75 0.75"
                    stroke="var(--color-gray-700)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden flex flex-col ${hasChatStarted ? 'items-start' : 'items-center justify-end'} [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:block [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-20 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200`}
        style={{ scrollbarGutter: 'stable', paddingRight: '0px' }}
      >
        {panelWidth < PANEL_COMPACT_THRESHOLD ? null : hasChatStarted ? (
          <div className="flex flex-col items-start w-full pb-[200px]">
            {chatHistory.map(entry =>
              entry.status === 'completed' && entry.briefingData ? (
                <AIChatThread
                  key={entry.id}
                  userMessage={entry.userMessage}
                  thinkingTime={entry.thinkingTime}
                  briefingData={entry.briefingData}
                />
              ) : (
                <div
                  key={entry.id}
                  className="flex flex-col items-start"
                  style={{ padding: '76px 50px 0 50px', alignSelf: 'stretch' }}
                >
                  <div
                    className="flex flex-col items-end"
                    style={{ padding: '40px 0 40px 160px', alignSelf: 'stretch' }}
                  >
                    <div className="flex items-center justify-center rounded-3 bg-primary-50 px-4 py-2">
                      <span className="body-04 text-primary-700">{entry.userMessage}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.status === 'loading' && (
                      <span className="body-04 text-gray-400">AI가 분석 중이에요...</span>
                    )}
                    {entry.status === 'empty' && (
                      <span className="body-04 text-gray-400">
                        조건에 맞는 결과를 찾지 못했어요.
                      </span>
                    )}
                    {entry.status === 'cancelled' && (
                      <span className="body-04 text-gray-400">응답이 중단되었어요.</span>
                    )}
                    {entry.status === 'error' && (
                      <span className="body-04 text-gray-400">브리핑에 실패했어요.</span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          /* Frame 11205: Empty State */
          <div
            className="flex flex-col items-start"
            style={{
              width: '100%',
              padding: '0 40px',
              gap: '26px',
              marginBottom: '62px',
              boxSizing: 'border-box',
            }}
          >
            {/* Frame 48: 타이틀 */}
            <div className="flex flex-col items-start gap-2 self-stretch">
              <img src={suitcaseIcon} alt="여행" width={32} height={32} />
              <div className="flex flex-col items-start gap-2 self-stretch">
                <h2 className="heading-05 text-black">어느 나라로 떠나고 싶으신가요?</h2>
                <p className="title-02 text-gray-600 self-stretch">
                  원하는 조건이나 예산을 자유롭게 적으면, OMO AI가 딱 맞는 도시를 찾아드릴게요.
                </p>
              </div>
            </div>

            {/* 추천 프롬프트 칩 목록 */}
            {chips.length > 0 && (
              <div className="flex flex-col items-start gap-2 self-stretch">
                {chips.map(chip => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => {
                      if (!isStreaming) submitQuery(chip.title, sessionId);
                    }}
                    className="flex items-center gap-1 bg-gray-20 hover:bg-gray-50 transition-colors"
                    style={{
                      height: '38px',
                      padding: '8px 20px',
                      borderRadius: '10px',
                      boxSizing: 'border-box',
                      maxWidth: '100%',
                    }}
                  >
                    <span
                      className="body-04 text-gray-700 text-left"
                      style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {chip.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Frame 11265: 하단 입력 영역 (그라데이션 + 입력창) — 좁아지면 숨김 */}
      {panelWidth >= PANEL_COMPACT_THRESHOLD && (
        <div
          style={{
            display: 'flex',
            width: '100%',
            padding: '0 50px 60px 50px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '4px',
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 19.71%)',
          }}
        >
          {/* R_Prompt Input Container 래퍼 (notice bar position 기준) */}
          <div className="relative" style={{ alignSelf: 'stretch' }}>
            {renderNoticeBar()}

            {/* R_Prompt Input Container */}
            <div
              className={`flex flex-col items-center rounded-4 ${isFocused ? 'border border-primary-400 bg-white' : 'border border-gray-100 bg-gray-20'}`}
              style={{
                padding: '20px 24px',
                alignSelf: 'stretch',
                boxShadow: isFocused
                  ? '0 4px 12px 0 rgba(23, 146, 255, 0.16)'
                  : '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
                gap: '8px',
                transition: 'border 0.15s, box-shadow 0.15s, background 0.15s',
              }}
            >
              {/* Frame 11211: 이미지(있을 경우) + 텍스트 입력 */}
              <div
                className="flex flex-col items-start"
                style={{ gap: '8px', alignSelf: 'stretch' }}
              >
                {/* Frame 11458: 텍스트 입력 */}
                <textarea
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="원하는 나라 조건을 자유롭게 입력해보세요. 예: 유럽에서 생활비가 저렴한 도시 추천해줘"
                  className="body-03 text-gray-900 placeholder:text-gray-400 bg-transparent border-none outline-hidden resize-none"
                  style={{
                    height: '48px',
                    alignSelf: 'stretch',
                    fontFamily: 'var(--font-pretendard)',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '150%',
                    letterSpacing: '-0.28px',
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
              </div>

              {/* Frame 11209: 아이콘 행 */}
              <div className="flex items-center justify-between" style={{ alignSelf: 'stretch' }}>
                {/* 전송 / 중지 버튼 */}
                {isStreaming ? (
                  <button
                    type="button"
                    aria-label="응답 중지"
                    onClick={handleStop}
                    className="flex items-center justify-center rounded-full border-none flex-shrink-0 cursor-pointer bg-gray-400"
                    style={{
                      width: '32px',
                      height: '32px',
                      padding: '6.25px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{
                        width: '17.5px',
                        height: '17.5px',
                        transform: 'rotate(-90deg)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          flexShrink: 0,
                          borderRadius: '1.25px',
                          background: '#fff',
                        }}
                      />
                    </div>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!hasText}
                    className={`flex items-center justify-center rounded-full border-none flex-shrink-0 transition-colors ${hasText ? 'bg-primary-500 cursor-pointer' : 'bg-gray-200 cursor-default'}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      padding: '6.25px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                    >
                      <path
                        d="M6.09375 11.4062L6.09375 0.781249M11.4063 6.09375L6.09375 0.781249L0.78125 6.09375"
                        stroke="white"
                        strokeWidth="1.5625"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
