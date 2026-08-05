import { useLocation, useNavigate } from 'react-router-dom';
import EmailVerificationPage from './EmailVerificationPage';
import { authApi } from '../api/authApi';

export default function PasswordResetVerifyRoute() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email: string = state?.email ?? '';

  return (
    <EmailVerificationPage
      email={email}
      onResend={async () => { await authApi.sendPasswordResetEmail({ email }); }}
      onVerify={async (code) => {
        await authApi.verifyPasswordResetCode({ email, code });
        navigate('/auth/password-reset/new', { state: { email, code } });
      }}
    />
  );
}
