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
  /** 비밀번호 찾기 모달을 어디서 열고 들어왔는지 — 'settings'면 설정 화면의 비밀번호 변경 흐름,
   *  그 외(기본)는 로그인 모달에서 진입한 홈 화면 흐름 */
  const returnContext: 'home' | 'settings' = state?.returnContext === 'settings' ? 'settings' : 'home';

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
        if (returnContext === 'settings') {
          navigate('/setting', { state: { reopenPasswordFind: true } });
        } else {
          navigate('/');
          openModal('forgot');
        }
      }}
      successDescription="이제 새 비밀번호를 설정할 수 있습니다."
      successButtonLabel="비밀번호 변경하기"
    />
  );
}
