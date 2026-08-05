import { useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModalOverlay from '../components/ModalOverlay';
import LoginModal from '../../features/auth/components/LoginModal';
import SignupModal from '../../features/auth/components/SignupModal';
import ForgotPasswordModal from '../../features/auth/components/ForgotPasswordModal';
import LoginRequiredModal from '../../features/auth/components/LoginRequiredModal';
import SearchModal from '../../features/search/components/SearchModal';
import AIChatPanel from '../../features/chat/components/AIChatPanel';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { memberApi } from '../../features/settings/api/memberApi';
import type { MainLayoutContext } from './useMainLayoutContext';
import { SIDEBAR_HANDLE_WIDTH } from '../constants/layout';

type RouteHandle = { headerVariant?: 'default' | 'overlay' | 'transparent' };

export default function MainLayout() {
  const { modalType, openModal, closeModal, isSearchOpen, closeSearch, signIn, signOut } = useAuthStore();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const controller = new AbortController();
    memberApi.getMyInfo()
      .then((info) => {
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
    return () => { controller.abort(); };
  }, []);
  const matches = useMatches();
  const headerVariant =
    matches.map((m) => (m.handle as RouteHandle | undefined)?.headerVariant).filter(Boolean).at(-1) ?? 'default';
  const isOverlay = headerVariant === 'overlay' || headerVariant === 'overlay-light';

  const openChat = useCallback((initialMessage?: string) => {
    setChatInitialMessage(initialMessage);
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setChatInitialMessage(undefined);
  }, []);

  const outletContext: MainLayoutContext = useMemo(() => ({ openChat, closeChat }), [openChat, closeChat]);

  return (
    <div className="relative flex min-h-screen flex-col">
      <ScrollRestoration />
      <div className={isOverlay ? 'absolute inset-x-0 top-0 z-20' : undefined}>
        <Header variant={headerVariant} onSmartBriefingClick={() => setIsChatOpen(true)} />
      </div>
      <main className="flex flex-1 flex-col">
        <Outlet context={outletContext} />
      </main>
      <Footer />

      <div className="fixed inset-y-0 right-0 z-40 flex">
        {/* Sidebar_Collapse_Handle */}
        <button
          type="button"
          onClick={() => setIsChatOpen((prev) => !prev)}
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

        {isChatOpen && (
          <AIChatPanel
            initialMessage={chatInitialMessage}
            onClose={closeChat}
            onNewChat={closeChat}
          />
        )}
      </div>

      {isSearchOpen && (
        <ModalOverlay onClose={closeSearch}>
          <SearchModal
            onClose={closeSearch}
            recentSearches={recentSearches}
            onRemove={(index) => setRecentSearches((prev) => prev.filter((_, i) => i !== index))}
            onClearAll={() => setRecentSearches([])}
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
