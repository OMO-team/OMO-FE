import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
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

  /** 회원가입 모달을 거치지 않고 URL로 직접 들어온 경우 — 인증할 이메일 자체가 없어 진행 불가 */
  useEffect(() => {
    if (!email) openModal('signup');
  }, [email, openModal]);

  if (!email) {
    return <Navigate to="/" replace />;
  }

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
