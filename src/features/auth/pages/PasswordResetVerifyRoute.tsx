import { useLocation, useNavigate } from 'react-router-dom';
import EmailVerificationPage from './EmailVerificationPage';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/useAuthStore';

export default function PasswordResetVerifyRoute() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const markResetPasswordEmailVerified = useAuthStore(s => s.markResetPasswordEmailVerified);
  const openModal = useAuthStore(s => s.openModal);
  const email: string = state?.email ?? '';

  return (
    <EmailVerificationPage
      email={email}
      onResend={async () => {
        await authApi.sendPasswordResetEmail({ email });
      }}
      onVerify={async code => {
        await authApi.verifyPasswordResetCode({ email, code });
        markResetPasswordEmailVerified();
      }}
      onServiceStart={() => {
        navigate('/');
        openModal('forgot');
      }}
      successDescription="이제 새 비밀번호를 설정할 수 있습니다."
      successButtonLabel="비밀번호 변경하기"
    />
  );
}
