import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

/** 인증 토큰 없이 URL로 직접 진입해도 보호된 화면이 보이지 않도록 홈으로 돌려보낸다 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const openModal = useAuthStore((s) => s.openModal);
  const hasToken = !!localStorage.getItem('accessToken');

  useEffect(() => {
    if (!hasToken) openModal('loginRequired');
  }, [hasToken, openModal]);

  if (!hasToken) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
