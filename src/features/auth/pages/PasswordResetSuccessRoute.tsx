import { useNavigate } from 'react-router-dom';
import PasswordResetSuccessPage from './PasswordResetSuccessPage';
import { useAuthStore } from '../store/useAuthStore';

export default function PasswordResetSuccessRoute() {
  const navigate = useNavigate();
  const openModal = useAuthStore((s) => s.openModal);

  return (
    <PasswordResetSuccessPage
      onLoginClick={() => {
        navigate('/');
        openModal('login');
      }}
    />
  );
}
