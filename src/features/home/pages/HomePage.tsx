import AIPromptSection from '../components/AIPromptSection';
import CategorySection from '../components/CategorySection';
import { useMainLayoutContext } from '../../../shared/layouts/useMainLayoutContext';
import mapBg from '../../../assets/images/map-bg.png';

export default function HomePage() {
  const { openChat } = useMainLayoutContext();

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* 배경 이미지 레이어 — 피그마 스펙 1440×770 고정 */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '1440px',
          height: '770px',
          aspectRatio: '144/77',
          background: `linear-gradient(286deg, rgba(255, 255, 255, 0.50) -1.67%, rgba(255, 255, 255, 0.00) 96.85%), url(${mapBg}) lightgray -437.967px -0.41px / 160.828% 168.621% no-repeat`,
        }}
      />
      <div className="relative flex flex-col items-center gap-[160px] px-[188px] py-[80px]">
        <AIPromptSection onSubmit={(value) => { if (value.trim()) openChat(value.trim()); }} />
        <CategorySection />
      </div>
    </div>
  );
}
