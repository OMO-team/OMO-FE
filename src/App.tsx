import { useState } from 'react';
import Header from './shared/components/Header';
import AIPromptSection from './features/home/components/AIPromptSection';
import LoginModal from './features/auth/components/LoginModal';
import SignupModal from './features/auth/components/SignupModal';
import ForgotPasswordModal from './features/auth/components/ForgotPasswordModal';
import ModalOverlay from './shared/components/ModalOverlay';

type ModalType = 'login' | 'signup' | 'forgotPassword' | null;

function App() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <div>
      <Header
        isLoggedIn={false}
        onLoginClick={() => setModal('login')}
        onSignupClick={() => setModal('signup')}
      />
      <div className="flex justify-center pt-10">
        <AIPromptSection />
      </div>

      {modal === 'login' && (
        <ModalOverlay onClose={() => setModal(null)}>
          <LoginModal
            onClose={() => setModal(null)}
            onSignupClick={() => setModal('signup')}
            onForgotPasswordClick={() => setModal('forgotPassword')}
          />
        </ModalOverlay>
      )}

      {modal === 'signup' && (
        <ModalOverlay onClose={() => setModal(null)}>
          <SignupModal
            onClose={() => setModal(null)}
            onLoginClick={() => setModal('login')}
          />
        </ModalOverlay>
      )}

      {modal === 'forgotPassword' && (
        <ForgotPasswordModal onClose={() => setModal(null)} />
      )}
    </div>
  );
}

export default App;
