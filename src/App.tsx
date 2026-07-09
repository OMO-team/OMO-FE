import Header from './components/common/Header';
import AIPromptSection from './components/mainHome/AIPromptSection';

function App() {
  return (
    <div>
      <Header />
      <div className="flex justify-center pt-10">
        <AIPromptSection />
      </div>
    </div>
  );
}
