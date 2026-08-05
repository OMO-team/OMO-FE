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
  const initialSeconds: number = state?.expiresInSeconds ?? 300;

  return (
    <EmailVerificationPage
      email={email}
      initialSeconds={initialSeconds}
      onResend={async () => {
        const result = await authApi.sendEmailCode({ email });
        return result.expiresInSeconds;
      }}
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
