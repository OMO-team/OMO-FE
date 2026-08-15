import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import PasswordResetSuccessPage from './PasswordResetSuccessPage';
import { useAuthStore } from '../store/useAuthStore';

export default function PasswordResetSuccessRoute() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const openModal = useAuthStore((s) => s.openModal);

  /** 비밀번호 찾기 모달의 재설정 완료 흐름을 거치지 않고 URL로 직접 들어온 경우 */
  if (!state?.completed) {
    return <Navigate to="/" replace />;
  }

  return (
    <PasswordResetSuccessPage
      onLoginClick={() => {
        navigate('/');
        openModal('login');
      }}
    />
  );
}
