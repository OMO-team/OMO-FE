import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleLinkCallbackRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const linked = searchParams.get('linked');
    const errorCode = searchParams.get('errorCode');

    if (linked === 'true') {
      navigate('/setting', { replace: true, state: { googleLinkResult: 'success' } });
    } else if (errorCode === 'AUTH409_3') {
      navigate('/setting', { replace: true, state: { googleLinkResult: 'error', googleLinkError: '이미 Google 계정이 연결되어 있습니다.' } });
    } else if (errorCode === 'AUTH409_4') {
      navigate('/setting', { replace: true, state: { googleLinkResult: 'error', googleLinkError: '이미 다른 계정에 연결된 Google 계정입니다.' } });
    } else {
      navigate('/setting', { replace: true, state: { googleLinkResult: 'error' } });
    }
  }, [searchParams, navigate]);

  return null;
}
