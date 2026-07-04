import { useState } from "react";
import { CityReportModal } from "./components/aireport";
import {
  berlinReportData,
  mockSearchResult,
} from "./components/aireport/mockData";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>리포트 열기</button>
      <CityReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={berlinReportData}
        onSearch={mockSearchResult}
      />
    </>
  );
}

export default App;
