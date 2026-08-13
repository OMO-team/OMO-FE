import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Outlet, ScrollRestoration, useLocation, useMatches } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModalOverlay from '../components/ModalOverlay';
import LoginModal from '../../features/auth/components/LoginModal';
import SignupModal from '../../features/auth/components/SignupModal';
import ForgotPasswordModal from '../../features/auth/components/ForgotPasswordModal';
import LoginRequiredModal from '../../features/auth/components/LoginRequiredModal';
import SearchModal from '../../features/search/components/SearchModal';
import {
  loadRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '../../features/search/utils/recentSearchesStorage';
import AIChatPanel from '../../features/chat/components/AIChatPanel';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { memberApi } from '../../features/settings/api/memberApi';
import type { TermsAndPolicyLocationState } from '../pages/TermsAndPolicyRoute';
import type { MainLayoutContext } from './useMainLayoutContext';
import { SIDEBAR_HANDLE_WIDTH } from '../constants/layout';

type RouteHandle = {
  headerVariant?: 'default' | 'overlay' | 'transparent';
  hasOwnChatEntry?: boolean;
};

export default function MainLayout() {
  const { modalType, openModal, closeModal, isSearchOpen, closeSearch, signIn, signOut } =
    useAuthStore();
  const [recentSearches, setRecentSearches] = useState<string[]>(() => loadRecentSearches());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const controller = new AbortController();
    memberApi
      .getMyInfo()
      .then(info => {
        if (controller.signal.aborted) return;
        if (localStorage.getItem('accessToken') !== token) return;
        signIn(info.profileImageUrl ?? undefined);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (localStorage.getItem('accessToken') !== token) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          signOut();
        }
      });
    return () => {
      controller.abort();
    };
  }, []);

  /**
   * 회원가입 모달에서 약관 확인을 위해 /support/terms로 이동했다가(fromSignup) 그 화면을 벗어나면
   * 회원가입 모달을 다시 연다. MainLayout은 인앱 네비게이션 중 언마운트되지 않으므로,
   * 화면 내 뒤로가기 버튼/브라우저 뒤로가기/제스처 등 이동 방식과 무관하게 항상 동작함.
   */
  const location = useLocation();
  const prevLocationRef = useRef(location);
  useEffect(() => {
    const prev = prevLocationRef.current;
    const prevState = prev.state as TermsAndPolicyLocationState | null;
    if (
      prev.pathname === '/support/terms' &&
      prevState?.fromSignup &&
      location.pathname !== '/support/terms'
    ) {
      openModal('signup');
    }
    prevLocationRef.current = location;
  }, [location, openModal]);

  const matches = useMatches();
  const headerVariant =
    matches
      .map(m => (m.handle as RouteHandle | undefined)?.headerVariant)
      .filter(Boolean)
      .at(-1) ?? 'default';
  const isOverlay = headerVariant === 'overlay';
  /** 페이지 자체에 채팅 진입점(홈의 프롬프트 입력창, 도시 탐색의 FAB)이 있으면 사이드바 손잡이가 중복이라 숨김 */
  const hasPageOwnChatEntry = matches.some(
    m => (m.handle as RouteHandle | undefined)?.hasOwnChatEntry
  );

  const openChat = useCallback((initialMessage?: string) => {
    setChatInitialMessage(initialMessage);
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setChatInitialMessage(undefined);
  }, []);

  const outletContext: MainLayoutContext = useMemo(
    () => ({ openChat, closeChat, isChatOpen }),
    [openChat, closeChat, isChatOpen]
  );

  return (
    <div className="relative flex min-h-screen min-w-[1200px] flex-col">
      <ScrollRestoration />
      <div className={isOverlay ? 'absolute inset-x-0 top-0 z-20' : undefined}>
        <Header variant={headerVariant} />
      </div>
      <main className="flex flex-1 flex-col">
        <Outlet context={outletContext} />
      </main>
      <Footer onOpenSmartBriefing={() => openChat()} />

      <div className="fixed inset-y-0 right-0 z-40 flex">
        {/* Sidebar_Collapse_Handle — 페이지 자체 채팅 진입점이 없는 곳에서만 노출 */}
        {!hasPageOwnChatEntry && (
          <button
            type="button"
            onClick={() => setIsChatOpen(prev => !prev)}
            aria-label={isChatOpen ? 'AI 채팅 닫기' : 'AI 채팅 열기'}
            className="flex h-full items-center cursor-pointer outline-none border-0"
            style={{
              width: `${SIDEBAR_HANDLE_WIDTH}px`,
              paddingLeft: '10px',
              background: '#FFF',
              borderLeft: '1px solid #E7EAEF',
            }}
          >
            <div
              className="flex flex-col items-start flex-shrink-0 bg-gray-200"
              style={{ width: '6px', height: '120px', borderRadius: '10px' }}
            />
          </button>
        )}

        {isChatOpen && <AIChatPanel initialMessage={chatInitialMessage} onClose={closeChat} />}
      </div>

      {isSearchOpen && (
        <ModalOverlay onClose={closeSearch} align="top">
          <SearchModal
            onClose={closeSearch}
            recentSearches={recentSearches}
            onSearch={query => setRecentSearches(addRecentSearch(query))}
            onRemove={index => setRecentSearches(removeRecentSearch(index))}
            onClearAll={() => setRecentSearches(clearRecentSearches())}
          />
        </ModalOverlay>
      )}

      {modalType === 'login' && (
        <ModalOverlay onClose={closeModal}>
          <LoginModal
            onClose={closeModal}
            onSignupClick={() => openModal('signup')}
            onForgotPasswordClick={() => openModal('forgot')}
          />
        </ModalOverlay>
      )}

      {modalType === 'signup' && (
        <ModalOverlay onClose={closeModal}>
          <SignupModal onClose={closeModal} onLoginClick={() => openModal('login')} />
        </ModalOverlay>
      )}

      {modalType === 'forgot' && (
        <ModalOverlay onClose={closeModal}>
          <ForgotPasswordModal onClose={closeModal} />
        </ModalOverlay>
      )}

      {modalType === 'loginRequired' && (
        <ModalOverlay onClose={closeModal}>
          <LoginRequiredModal onClose={closeModal} onLoginClick={() => openModal('login')} />
        </ModalOverlay>
      )}
    </div>
  );
}
