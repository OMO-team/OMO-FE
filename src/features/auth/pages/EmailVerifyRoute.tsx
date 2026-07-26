import { useLocation, useNavigate } from 'react-router-dom';
import EmailVerificationPage from './EmailVerificationPage';
import { authApi } from '../api/authApi';

export default function EmailVerifyRoute() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email: string = state?.email ?? '';

  return (
    <EmailVerificationPage
      email={email}
      onResend={() => authApi.sendEmailCode({ email })}
      onVerify={async (code) => {
        await authApi.verifyEmailCode({ email, code });
        navigate('/');
      }}
    />
  );
}
