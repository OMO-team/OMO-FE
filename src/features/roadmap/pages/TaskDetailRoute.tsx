import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import { apostilleRequiredDocuments } from '../mocks/mockData';

const APOSTILLE_INFO_BANNER =
  '해외에서 한국 학력을 인정받기 위해 필요한 공증 절차입니다. 외교부 영사민원24를 통해 온라인으로 신청할 수 있습니다.';

export default function TaskDetailRoute() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState(apostilleRequiredDocuments);

  const handleCheck = (taskDocumentId: number) => {
    setDocuments((prev) => prev.map((d) => (d.taskDocumentId === taskDocumentId ? { ...d, isChecked: true } : d)));
  };

  return (
    <ModalOverlay onClose={() => navigate(-1)}>
      <DocumentTaskDetailModal
        category="비자"
        title="아포스티유 공증"
        infoBanner={APOSTILLE_INFO_BANNER}
        documents={documents}
        dDayLabel="D-000"
        scheduledDate="2026.04.15"
        onClose={() => navigate(-1)}
        onCheck={handleCheck}
      />
    </ModalOverlay>
  );
}
