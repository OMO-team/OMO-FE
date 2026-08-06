import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DocumentTaskDetailModal from '../components/DocumentTaskDetailModal';
import type { DocumentScheduleState } from '../components/RequiredDocumentCard';
import DocumentUploadModal from '../components/DocumentUploadModal';
import DatePickerModal from '../components/DatePickerModal';
import ModalOverlay from '../../../shared/components/ModalOverlay';
import { tasksApi } from '../api/tasksApi';
import { taskDocumentsApi } from '../api/taskDocumentsApi';
import { roadmapQueryKeys, taskQueryKeys } from '../api/queryKeys';
import { formatDDay, formatDotDate, TASK_CATEGORY_LABEL, toRequiredDocumentData } from '../utils/roadmapDetailAdapter';
import type { UploadedFileItem } from '../types/roadmap';
import type { TaskDetailResult } from '../types/api';

/**
 * 서류 카드 색을 정하는 일정 상태.
 * 마감일이 없으면 아직 일정을 안 잡은 것이고, scheduleDDay가 0이면 오늘이 마감이다.
 */
function toScheduleState(task: TaskDetailResult): DocumentScheduleState {
  if (!task.dueDate) return 'unscheduled';
  // 태스크를 완료하면 백엔드가 isOverdue를 false로 되돌리는데, 시안의 "기간 지남 + 수행 O"는
  // 완료한 뒤에도 유지되는 상태라 완료 여부를 타지 않는 D-day 부호로 판단한다
  if (task.isOverdue || (task.scheduleDDay ?? 0) < 0) return 'overdue';
  if (task.scheduleDDay === 0) return 'today';
  return 'scheduled';
}

function parseIsoDate(value: string | null) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

export default function TaskDetailRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { roadmapId, taskId } = useParams<{ roadmapId: string; taskId: string }>();
  const numericTaskId = Number(taskId);
  const numericRoadmapId = Number(roadmapId);

  const [uploadTargetDocumentId, setUploadTargetDocumentId] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  /**
   * 서류별로 업로드한 파일명 — 카드 안의 파일 칩 목록에 쓴다.
   * 태스크 상세 응답(DocumentItem)에 파일 필드가 없어서 화면에서만 들고 있다(새로고침하면 사라짐).
   * 백엔드에 파일 목록이 추가되면 이 상태 대신 응답값을 쓰면 된다.
   */
  const [filesByDocument, setFilesByDocument] = useState<Record<number, string[]>>({});
  /**
   * 편집 중인 태스크 이름. 아직 이름 변경 API가 없어서(/api/v1/tasks/{taskId}는 GET만 있음)
   * 화면에서만 바뀌고 서버에는 저장되지 않는다 — 엔드포인트가 생기면 여기서 호출하면 된다.
   */
  const [editedTitle, setEditedTitle] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'day' | 'month'>('day');
  const [datePickerViewYear, setDatePickerViewYear] = useState(new Date().getFullYear());
  const [datePickerViewMonth, setDatePickerViewMonth] = useState(new Date().getMonth() + 1);

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

  const isValidTaskId = Number.isFinite(numericTaskId);

  const { data: taskDetail, isError } = useQuery({
    queryKey: taskQueryKeys.detail(numericTaskId),
    queryFn: () => tasksApi.get(numericTaskId),
    enabled: isValidTaskId,
  });

  useEffect(() => {
    if (!isValidTaskId || isError) closeTaskDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidTaskId, isError]);

  const documents = useMemo(
    () =>
      (taskDetail?.documents ?? []).map((document) => ({
        ...toRequiredDocumentData(document),
        uploadedFiles: filesByDocument[document.taskDocumentId],
      })),
    [taskDetail, filesByDocument],
  );

  /** 태스크/로드맵 상세 둘 다 새로고침 — 서류 체크·일정 변경·완료 처리 모두 타임라인 진행률에 영향을 주기 때문 */
  const invalidateTaskAndRoadmap = () => {
    queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(numericTaskId) });
    queryClient.invalidateQueries({ queryKey: roadmapQueryKeys.detail(numericRoadmapId) });
  };

  /** 체크 먼저 화면에 반영하고, 실패하면 되돌림 — 서류 촬영 자동 체크에도 동일하게 사용 */
  const checkDocumentMutation = useMutation({
    mutationFn: (taskDocumentId: number) => taskDocumentsApi.updateCheck(taskDocumentId, { checked: true }),
    onMutate: async (taskDocumentId) => {
      await queryClient.cancelQueries({ queryKey: taskQueryKeys.detail(numericTaskId) });
      const previous = queryClient.getQueryData<TaskDetailResult>(taskQueryKeys.detail(numericTaskId));
      queryClient.setQueryData<TaskDetailResult>(taskQueryKeys.detail(numericTaskId), (old) =>
        old
          ? {
              ...old,
              documents: old.documents.map((d) => (d.taskDocumentId === taskDocumentId ? { ...d, checked: true } : d)),
            }
          : old,
      );
      return { previous };
    },
    onError: (error, _taskDocumentId, context) => {
      console.error('서류 체크 실패', error);
      if (context?.previous) queryClient.setQueryData(taskQueryKeys.detail(numericTaskId), context.previous);
    },
    onSettled: invalidateTaskAndRoadmap,
  });

  const updateTaskScheduleMutation = useMutation({
    mutationFn: (dueDate: string) => tasksApi.updateSchedule(numericTaskId, { dueDate }),
    onSuccess: invalidateTaskAndRoadmap,
    onError: (error) => console.error('태스크 일정 변경 실패', error),
  });

  const completeTaskMutation = useMutation({
    mutationFn: () => tasksApi.complete(numericTaskId),
    onSuccess: invalidateTaskAndRoadmap,
    onError: (error) => console.error('태스크 완료 처리 실패', error),
  });

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

  const handleSelectDay = (day: number) => {
    setIsDatePickerOpen(false);
    const iso = `${datePickerViewYear}-${String(datePickerViewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    updateTaskScheduleMutation.mutate(iso);
  };

  if (!taskDetail) return null;

  const parsedDue = parseIsoDate(taskDetail.dueDate);

  return (
    <>
      <ModalOverlay onClose={closeTaskDetail}>
        <DocumentTaskDetailModal
          category={TASK_CATEGORY_LABEL[taskDetail.category]}
          title={editedTitle ?? taskDetail.name}
          editableTitle
          onTitleChange={setEditedTitle}
          infoBanner={taskDetail.description}
          dDayLabel={formatDDay(taskDetail.scheduleDDay)}
          scheduledDate={formatDotDate(taskDetail.dueDate)}
          onDateClick={handleOpenDatePicker}
          // 상단 날짜 버튼과 같은 달력을 연다 — 마감일이 없으면 추가, 있으면 변경
          onAddSchedule={handleOpenDatePicker}
          onClose={closeTaskDetail}
          documents={documents}
          locked={taskDetail.status === 'LOCKED'}
          onOpenUpload={(taskDocumentId) => {
            setUploadedFiles([]);
            setUploadTargetDocumentId(taskDocumentId);
          }}
          onCheck={(taskDocumentId) => checkDocumentMutation.mutate(taskDocumentId)}
          isCompleted={taskDetail.isCompleted}
          onComplete={() => completeTaskMutation.mutate()}
          isCompleting={completeTaskMutation.isPending}
          scheduleState={toScheduleState(taskDetail)}
        />
      </ModalOverlay>

      {uploadTargetDocumentId !== null && (
        <ModalOverlay zIndex={60} onClose={() => setUploadTargetDocumentId(null)}>
          <DocumentUploadModal
            files={uploadedFiles}
            onSelectFiles={handleSelectFiles}
            onRemoveFile={(name) => setUploadedFiles((prev) => prev.filter((f) => f.name !== name))}
            onComplete={() => {
              // 업로드가 끝난 파일명을 서류에 붙여두어야 카드에 파일 칩으로 보인다
              const fileNames = uploadedFiles.map((file) => file.name);
              setFilesByDocument((prev) => ({
                ...prev,
                [uploadTargetDocumentId]: [...(prev[uploadTargetDocumentId] ?? []), ...fileNames],
              }));
              checkDocumentMutation.mutate(uploadTargetDocumentId);
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
