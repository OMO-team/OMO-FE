import { useState, useEffect } from 'react';
import { Outlet, ScrollRestoration, useMatches } from 'react-router-dom';
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
import type { MainLayoutContext } from './useMainLayoutContext';

type RouteHandle = { headerVariant?: 'default' | 'overlay' };

export default function MainLayout() {
  const { modalType, openModal, closeModal, isSearchOpen, closeSearch, signIn } = useAuthStore();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) signIn();
  }, []);
  const matches = useMatches();
  const headerVariant =
    matches.map((m) => (m.handle as RouteHandle | undefined)?.headerVariant).filter(Boolean).at(-1) ?? 'default';
  const isOverlay = headerVariant === 'overlay';

  const outletContext: MainLayoutContext = {
    openChat: (initialMessage?: string) => {
      setChatInitialMessage(initialMessage);
      setIsChatOpen(true);
    },
    closeChat: () => setIsChatOpen(false),
  };

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
            width: '40px',
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
            onClose={() => { setIsChatOpen(false); setChatInitialMessage(undefined); }}
            onNewChat={() => setIsChatOpen(false)}
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
