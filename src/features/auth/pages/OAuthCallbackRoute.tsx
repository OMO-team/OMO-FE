import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { memberApi } from '../../settings/api/memberApi';
import { useAuthStore } from '../store/useAuthStore';

export default function OAuthCallbackRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const signIn = useAuthStore((s) => s.signIn);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const ticket = searchParams.get('ticket');
    const error = searchParams.get('error');

    if (error || !ticket) {
      navigate('/', { replace: true });
      return;
    }

    authApi.exchangeGoogleTicket({ ticket })
      .then(() => memberApi.getMyInfo().catch(() => null))
      .then((info) => {
        signIn(info?.profileImageUrl ?? undefined);
        navigate('/', { replace: true });
      })
      .catch(() => {
        navigate('/', { replace: true });
      });
  }, [searchParams, navigate, signIn]);

  return null;
}
