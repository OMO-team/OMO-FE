import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleLinkCallbackRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const error = searchParams.get('error');

    // 성공·실패 모두 설정 페이지로 이동, state로 결과 전달
    navigate('/setting', {
      replace: true,
      state: { googleLinkResult: error ? 'error' : 'success' },
    });
  }, [searchParams, navigate]);

  return null;
}
