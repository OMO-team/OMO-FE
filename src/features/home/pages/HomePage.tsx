import { useState } from 'react';
import Header from '../../../shared/components/Header';
import Footer from '../../../shared/components/Footer';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import AIPromptSection from '../components/AIPromptSection';
import CategorySection from '../components/CategorySection';
import LoginModal from '../../auth/components/LoginModal';
import SignupModal from '../../auth/components/SignupModal';
import ForgotPasswordModal from '../../auth/components/ForgotPasswordModal';
import LoginRequiredModal from '../../auth/components/LoginRequiredModal';
import AIChatPanel from '../../chat/components/AIChatPanel';
import SearchModal from '../../search/components/SearchModal';

type AuthModal = 'login' | 'signup' | 'forgot' | 'loginRequired' | null;

export default function HomePage() {
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const closeModal = () => setAuthModal(null);

  const handlePromptSubmit = (value: string) => {
    if (!value.trim()) return;
    setIsChatOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        isLoggedIn={false}
        onLoginClick={() => setAuthModal('login')}
        onSignupClick={() => setAuthModal('signup')}
        onSearchClick={() => setIsSearchOpen(true)}
        onExploreClick={() => setAuthModal('loginRequired')}
        onMyHomeClick={() => setAuthModal('loginRequired')}
        onSmartBriefingClick={() => setIsChatOpen(true)}
      />

      <main className="flex flex-1 flex-col items-center gap-[120px] px-[188px] py-[80px]">
        <AIPromptSection onSubmit={handlePromptSubmit} />
        <CategorySection />
      </main>

      <Footer />

      {isChatOpen && (
        <AIChatPanel
          hasChat={true}
          onClose={() => setIsChatOpen(false)}
          onNewChat={() => setIsChatOpen(false)}
        />
      )}

      {isSearchOpen && (
        <ModalOverlay onClose={() => setIsSearchOpen(false)}>
          <SearchModal
            onClose={() => setIsSearchOpen(false)}
            recentSearches={recentSearches}
            onRemove={(index) => setRecentSearches((prev) => prev.filter((_, i) => i !== index))}
            onClearAll={() => setRecentSearches([])}
          />
        </ModalOverlay>
      )}

      {authModal === 'login' && (
        <ModalOverlay onClose={closeModal}>
          <LoginModal
            onClose={closeModal}
            onSignupClick={() => setAuthModal('signup')}
            onForgotPasswordClick={() => setAuthModal('forgot')}
          />
        </ModalOverlay>
      )}

      {authModal === 'signup' && (
        <ModalOverlay onClose={closeModal}>
          <SignupModal
            onClose={closeModal}
            onLoginClick={() => setAuthModal('login')}
          />
        </ModalOverlay>
      )}

      {authModal === 'forgot' && (
        <ModalOverlay onClose={closeModal}>
          <ForgotPasswordModal onClose={closeModal} />
        </ModalOverlay>
      )}

      {authModal === 'loginRequired' && (
        <ModalOverlay onClose={closeModal}>
          <LoginRequiredModal
            onClose={closeModal}
            onLoginClick={() => setAuthModal('login')}
          />
        </ModalOverlay>
      )}
    </div>
  );
}
