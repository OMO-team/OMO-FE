import { useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
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

export default function MainLayout() {
  const { modalType, openModal, closeModal, isSearchOpen, closeSearch } = useAuthStore();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const outletContext: MainLayoutContext = {
    openChat: () => setIsChatOpen(true),
    closeChat: () => setIsChatOpen(false),
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration/>
      <Header onSmartBriefingClick={() => setIsChatOpen(true)} />
      <main className="flex flex-1 flex-col">
        <Outlet context={outletContext} />
      </main>
      <Footer />

      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 z-40">
          <AIChatPanel
            hasChat={true}
            onClose={() => setIsChatOpen(false)}
            onNewChat={() => setIsChatOpen(false)}
          />
        </div>
      )}

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
