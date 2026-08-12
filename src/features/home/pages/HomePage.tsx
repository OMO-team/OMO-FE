import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AIPromptSection from '../components/AIPromptSection';
import CategorySection from '../components/CategorySection';
import TopAlertBanner from '../../../shared/components/TopAlertBanner';
import { useMainLayoutContext } from '../../../shared/layouts/useMainLayoutContext';
import mapBg from '../../../assets/images/map-bg.png';

type HomeLocationState = { oauthError?: string } | null;

export default function HomePage() {
  const { openChat } = useMainLayoutContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [oauthError, setOauthError] = useState(
    (location.state as HomeLocationState)?.oauthError ?? null,
  );

  useEffect(() => {
    if (!(location.state as HomeLocationState)?.oauthError) return;
    // 새로고침/뒤로가기 시 배너가 다시 뜨지 않도록 state를 즉시 비운다.
    navigate(location.pathname, { replace: true, state: null });
    // 마운트 시 1회만 실행 — location.state는 초기값만 사용한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex flex-1 flex-col">
      {/* 배경 이미지 레이어 — 피그마 스펙 1440×770 고정, 헤더 높이(88px)만큼 올려서 페이지 최상단 기준 정렬 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[88px] pointer-events-none"
        style={{
          width: '1440px',
          height: '770px',
          zIndex: -1,
          background: `linear-gradient(286deg, rgba(255, 255, 255, 0.50) -1.67%, rgba(255, 255, 255, 0.00) 96.85%), url(${mapBg}) lightgray -437.967px -0.41px / 160.828% 168.621% no-repeat`,
        }}
      />
      {oauthError && (
        <div className="relative flex justify-center pt-6">
          <TopAlertBanner variant="red" message={oauthError} onClose={() => setOauthError(null)} />
        </div>
      )}
      <div className="relative flex flex-col items-center gap-[160px] px-[188px] pt-[160px] pb-[80px]">
        <AIPromptSection onSubmit={(value) => { if (value.trim()) openChat(value.trim()); }} />
        <CategorySection />
      </div>
    </div>
  );
}
