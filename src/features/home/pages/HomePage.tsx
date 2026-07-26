import { useState } from 'react';
import AIPromptSection from '../components/AIPromptSection';
import CategorySection from '../components/CategorySection';
import AIChatPanel from '../../chat/components/AIChatPanel';

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col items-center gap-[120px] px-[188px] py-[80px]">
        <AIPromptSection onSubmit={(value) => { if (value.trim()) setIsChatOpen(true); }} />
        <CategorySection />
      </div>

      {isChatOpen && (
        <AIChatPanel
          hasChat={true}
          onClose={() => setIsChatOpen(false)}
          onNewChat={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}
