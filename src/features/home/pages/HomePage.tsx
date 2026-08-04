import AIPromptSection from '../components/AIPromptSection';
import CategorySection from '../components/CategorySection';
import { useMainLayoutContext } from '../../../shared/layouts/useMainLayoutContext';
import { SIDEBAR_HANDLE_WIDTH } from '../../../shared/constants/layout';
import mapBg from '../../../assets/images/map-bg.png';

export default function HomePage() {
  const { openChat } = useMainLayoutContext();

  return (
    <div className="relative flex flex-1 flex-col">
      {/* 배경 이미지 레이어 — 피그마 스펙 1440×770 고정, 헤더 높이(88px)만큼 올려서 페이지 최상단 기준 정렬 */}
      <div
        className="absolute inset-x-0 -top-[88px] pointer-events-none"
        style={{
          height: '770px',
          zIndex: -1,
          background: `linear-gradient(286deg, rgba(255, 255, 255, 0.50) -1.67%, rgba(255, 255, 255, 0.00) 96.85%), url(${mapBg}) lightgray -437.967px -0.41px / 160.828% 168.621% no-repeat`,
        }}
      />
      <div className="relative flex flex-col items-center gap-[160px] px-[188px] pt-[160px] pb-[80px]">
        <AIPromptSection onSubmit={(value) => { if (value.trim()) openChat(value.trim()); }} />
        <CategorySection />
      </div>
    </div>
  );
}
