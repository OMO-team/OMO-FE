import AIPromptSection from '../components/AIPromptSection';
import CategorySection from '../components/CategorySection';
import { useMainLayoutContext } from '../../../shared/layouts/useMainLayoutContext';
import mapBg from '../../../assets/images/map-bg.png';

export default function HomePage() {
  const { openChat } = useMainLayoutContext();

  return (
    <div
      className="flex flex-1 flex-col items-center gap-[160px] px-[188px] py-[80px]"
      style={{
        background: `linear-gradient(286deg, rgba(255, 255, 255, 0.50) -1.67%, rgba(255, 255, 255, 0.00) 96.85%), url(${mapBg}) lightgray -437.967px -0.41px / 160.828% 168.621% no-repeat`,
      }}
    >
      <AIPromptSection onSubmit={(value) => { if (value.trim()) openChat(value.trim()); }} />
      <CategorySection />
    </div>
  );
}
