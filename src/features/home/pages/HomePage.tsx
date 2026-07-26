import AIPromptSection from '../components/AIPromptSection';
import CategorySection from '../components/CategorySection';
import { useMainLayoutContext } from '../../../shared/layouts/useMainLayoutContext';

export default function HomePage() {
  const { openChat } = useMainLayoutContext();

  return (
    <div className="flex flex-1 flex-col items-center gap-[120px] px-[188px] py-[80px]">
      <AIPromptSection onSubmit={(value) => { if (value.trim()) openChat(); }} />
      <CategorySection />
    </div>
  );
}
