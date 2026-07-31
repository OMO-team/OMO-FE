import { useLocation, useNavigate } from 'react-router-dom';
import EmailVerificationPage from './EmailVerificationPage';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export default function EmailVerifyRoute() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const markSignupEmailVerified = useAuthStore((s) => s.markSignupEmailVerified);
  const openModal = useAuthStore((s) => s.openModal);
  const email: string = state?.email ?? '';

  return (
    <EmailVerificationPage
      email={email}
      onResend={() => authApi.sendEmailCode({ email })}
      onVerify={async (code) => {
        await authApi.verifyEmailCode({ email, code });
        markSignupEmailVerified();
      }}
      onServiceStart={() => {
        navigate('/');
        openModal('signup');
      }}
    />
  );
}
