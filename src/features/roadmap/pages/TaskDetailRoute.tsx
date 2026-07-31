import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import { tasksApi } from '../api/tasksApi';
import { taskDocumentsApi } from '../api/taskDocumentsApi';
import { formatDotDate, TASK_CATEGORY_LABEL, toRequiredDocumentData } from '../utils/roadmapDetailAdapter';
import type { TaskDetailContext } from './RoadmapDetail';
import type { RequiredDocumentData, UploadedFileItem } from '../types/roadmap';
import type { TaskDetailResult } from '../types/api';

export default function TaskDetailRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = useParams<{ taskId: string }>();
  const { onDateClick } = useOutletContext<TaskDetailContext>();

  const [taskDetail, setTaskDetail] = useState<TaskDetailResult | undefined>(undefined);
  const [documents, setDocuments] = useState<RequiredDocumentData[]>([]);
  const [uploadTargetDocumentId, setUploadTargetDocumentId] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);

  /**
   * 태스크 모달은 타임라인에서 push로 열리므로, 닫을 때도 push('..')가 아니라 -1로 되돌려야
   * 상세 화면 히스토리가 중복으로 쌓이지 않음(중복되면 "목록으로"가 목록 대신 이 모달로 되돌아가는 버그 발생).
   * location.key === 'default'면 새로고침/직접 진입이라 되돌아갈 히스토리가 없으므로 상위 경로로 이동.
   */
  const closeTaskDetail = () => {
    if (location.key === 'default') {
      navigate('..', { replace: true, preventScrollReset: true });
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    const numericTaskId = Number(taskId);
    if (!Number.isFinite(numericTaskId)) {
      closeTaskDetail();
      return;
    }
    tasksApi
      .get(numericTaskId)
      .then((result) => {
        setTaskDetail(result);
        setDocuments(result.documents.map(toRequiredDocumentData));
      })
      .catch((error) => {
        console.error('태스크 상세 조회 실패', error);
        closeTaskDetail();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  /** 체크 먼저 화면에 반영하고, 실패하면 되돌림 — 서류 촬영 자동 체크에도 동일하게 사용 */
  const handleCheckDocument = async (taskDocumentId: number) => {
    setDocuments((prev) => prev.map((d) => (d.taskDocumentId === taskDocumentId ? { ...d, isChecked: true } : d)));
    try {
      await taskDocumentsApi.updateCheck(taskDocumentId, { checked: true });
    } catch (error) {
      console.error('서류 체크 실패', error);
      setDocuments((prev) => prev.map((d) => (d.taskDocumentId === taskDocumentId ? { ...d, isChecked: false } : d)));
    }
  };

  const handleSelectFiles = (fileList: FileList) => {
    const newItems: UploadedFileItem[] = Array.from(fileList).map((file) => ({
      name: file.name,
      uploadedSizeMB: 0,
      totalSizeMB: Math.max(1, Math.round(file.size / 1024 / 1024)),
      status: 'uploading',
    }));
    setUploadedFiles((prev) => [...prev, ...newItems]);
    newItems.forEach((item) => {
      setTimeout(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.name === item.name ? { ...f, uploadedSizeMB: f.totalSizeMB, status: 'processing' } : f)),
        );
      }, 1500);
      setTimeout(() => {
        setUploadedFiles((prev) => prev.map((f) => (f.name === item.name ? { ...f, status: 'completed' } : f)));
      }, 3000);
    });
  };

  if (!taskDetail) return null;

  return (
    <>
      <ModalOverlay onClose={closeTaskDetail}>
        <DocumentTaskDetailModal
          category={TASK_CATEGORY_LABEL[taskDetail.category]}
          title={taskDetail.name}
          infoBanner={taskDetail.description}
          dDayLabel={taskDetail.scheduleDDay != null ? `D-${taskDetail.scheduleDDay}` : undefined}
          scheduledDate={formatDotDate(taskDetail.dueDate)}
          onDateClick={onDateClick}
          onClose={closeTaskDetail}
          documents={documents}
          locked={taskDetail.status === 'LOCKED'}
          onOpenUpload={(taskDocumentId) => {
            setUploadedFiles([]);
            setUploadTargetDocumentId(taskDocumentId);
          }}
          onCheck={handleCheckDocument}
        />
      </ModalOverlay>

      {uploadTargetDocumentId !== null && (
        <ModalOverlay zIndex={60} onClose={() => setUploadTargetDocumentId(null)}>
          <DocumentUploadModal
            files={uploadedFiles}
            onSelectFiles={handleSelectFiles}
            onRemoveFile={(name) => setUploadedFiles((prev) => prev.filter((f) => f.name !== name))}
            onComplete={() => {
              handleCheckDocument(uploadTargetDocumentId);
              setUploadTargetDocumentId(null);
            }}
            onClose={() => setUploadTargetDocumentId(null)}
          />
        </ModalOverlay>
      )}
    </>
  );
}
