import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import DocumentUploadModal from '../components/DocumentUploadModal';
import DatePickerModal from '../components/DatePickerModal';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import { tasksApi } from '../api/tasksApi';
import { taskDocumentsApi } from '../api/taskDocumentsApi';
import { formatDotDate, TASK_CATEGORY_LABEL, toRequiredDocumentData } from '../utils/roadmapDetailAdapter';
import type { TaskDetailContext } from './RoadmapDetail';
import type { RequiredDocumentData, UploadedFileItem } from '../types/roadmap';
import type { TaskDetailResult } from '../types/api';

function parseIsoDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

export default function TaskDetailRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = useParams<{ taskId: string }>();
  const { onTaskUpdated } = useOutletContext<TaskDetailContext>();

  const [taskDetail, setTaskDetail] = useState<TaskDetailResult | undefined>(undefined);
  const [documents, setDocuments] = useState<RequiredDocumentData[]>([]);
  const [uploadTargetDocumentId, setUploadTargetDocumentId] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'day' | 'month'>('day');
  const [datePickerViewYear, setDatePickerViewYear] = useState(new Date().getFullYear());
  const [datePickerViewMonth, setDatePickerViewMonth] = useState(new Date().getMonth() + 1);

  const numericTaskId = Number(taskId);

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

  const loadTaskDetail = () => {
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
  };

  useEffect(() => {
    if (!Number.isFinite(numericTaskId)) {
      closeTaskDetail();
      return;
    }
    loadTaskDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  /** 체크 먼저 화면에 반영하고, 실패하면 되돌림 — 서류 촬영 자동 체크에도 동일하게 사용 */
  const handleCheckDocument = async (taskDocumentId: number) => {
    setDocuments((prev) => prev.map((d) => (d.taskDocumentId === taskDocumentId ? { ...d, isChecked: true } : d)));
    try {
      await taskDocumentsApi.updateCheck(taskDocumentId, { checked: true });
      // 모든 서류가 체크되면 백엔드가 태스크를 자동 완료 처리하므로, 진행률/타임라인 갱신을 위해 상세를 다시 불러옴
      loadTaskDetail();
      onTaskUpdated();
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

  const handleOpenDatePicker = () => {
    const parsed = parseIsoDate(taskDetail?.dueDate ?? null);
    setDatePickerViewYear(parsed?.year ?? new Date().getFullYear());
    setDatePickerViewMonth(parsed?.month ?? new Date().getMonth() + 1);
    setDatePickerMode('day');
    setIsDatePickerOpen(true);
  };

  const handleSelectDay = async (day: number) => {
    setIsDatePickerOpen(false);
    const iso = `${datePickerViewYear}-${String(datePickerViewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    try {
      await tasksApi.updateSchedule(numericTaskId, { dueDate: iso });
      loadTaskDetail();
      onTaskUpdated();
    } catch (error) {
      console.error('태스크 일정 변경 실패', error);
    }
  };

  const handleComplete = async () => {
    try {
      await tasksApi.complete(numericTaskId);
      loadTaskDetail();
      onTaskUpdated();
    } catch (error) {
      console.error('태스크 완료 처리 실패', error);
    }
  };

  if (!taskDetail) return null;

  const parsedDue = parseIsoDate(taskDetail.dueDate);

  return (
    <>
      <ModalOverlay onClose={closeTaskDetail}>
        <DocumentTaskDetailModal
          category={TASK_CATEGORY_LABEL[taskDetail.category]}
          title={taskDetail.name}
          infoBanner={taskDetail.description}
          dDayLabel={taskDetail.scheduleDDay != null ? `D-${taskDetail.scheduleDDay}` : undefined}
          scheduledDate={formatDotDate(taskDetail.dueDate)}
          onDateClick={handleOpenDatePicker}
          onClose={closeTaskDetail}
          documents={documents}
          locked={taskDetail.status === 'LOCKED'}
          onOpenUpload={(taskDocumentId) => {
            setUploadedFiles([]);
            setUploadTargetDocumentId(taskDocumentId);
          }}
          onCheck={handleCheckDocument}
          isCompleted={taskDetail.isCompleted}
          onComplete={handleComplete}
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

      {isDatePickerOpen && (
        <ModalOverlay zIndex={60} onClose={() => setIsDatePickerOpen(false)}>
          <DatePickerModal
            mode={datePickerMode}
            year={datePickerViewYear}
            month={datePickerViewMonth}
            selectedDay={
              parsedDue?.year === datePickerViewYear && parsedDue?.month === datePickerViewMonth
                ? parsedDue.day
                : undefined
            }
            selectedMonth={datePickerViewMonth}
            onClose={() => setIsDatePickerOpen(false)}
            onModeToggle={() => setDatePickerMode((m) => (m === 'day' ? 'month' : 'day'))}
            onSelectMonth={(m) => {
              setDatePickerViewMonth(m);
              setDatePickerMode('day');
            }}
            onYearPrev={() => setDatePickerViewYear((y) => y - 1)}
            onYearNext={() => setDatePickerViewYear((y) => y + 1)}
            onSelectDay={handleSelectDay}
          />
        </ModalOverlay>
      )}
    </>
  );
}
