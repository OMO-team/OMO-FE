import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
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
      .catch((error: unknown) => {
        if (axios.isAxiosError<{ code?: string }>(error)) {
          const code = error.response?.data?.code;
          if (code === 'AUTH400_6') {
            navigate('/', { replace: true, state: { oauthError: 'Google 로그인 세션이 만료되었습니다. 다시 시도해주세요.' } });
            return;
          }
          if (code === 'MEMBER404_1') {
            navigate('/', { replace: true, state: { oauthError: '회원 정보를 찾을 수 없습니다. 다시 시도해주세요.' } });
            return;
          }
        }
        navigate('/', { replace: true });
      });
  }, [searchParams, navigate, signIn]);

  return null;
}
