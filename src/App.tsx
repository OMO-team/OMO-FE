import Header from "./shared/components/Header";
import AIPromptSection from "./features/home/components/AIPromptSection";

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

export default App;
