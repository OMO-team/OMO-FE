import CalendarIcon from './icons/CalendarIcon';
import EditIcon from './icons/EditIcon';
import PlusScheduleIcon from './icons/PlusScheduleIcon';
import WarningIcon from './icons/WarningIcon';
import RequiredDocumentCard, { type DocumentScheduleState } from './RequiredDocumentCard';
import LargeFillButton from '../../../shared/components/LargeFillButton';
import type { RequiredDocumentData } from '../types/roadmap';

type DocumentTaskDetailModalProps = {
  category: string;
  title: string;
  infoBanner: string;
  documents: RequiredDocumentData[];
  onClose?: () => void;
  /** 일정이 잡혀있을 때만 표시되는 D-day 태그 (예: "D-000") */
  dDayLabel?: string;
  /** 일정 날짜가 있을 때 날짜 선택 버튼으로 표시 (예: "2026.04.15") */
  scheduledDate?: string;
  onDateClick?: () => void;
  /** true면 제목을 입력 가능한 필드로 표시 (연필 아이콘 + 클릭해서 수정) */
  editableTitle?: boolean;
  onTitleChange?: (title: string) => void;
  /** 지정하면 하단 우측에 "+ 일정 추가하기" 버튼 표시 — 서류 유무와 상관없이 노출된다 */
  onAddSchedule?: () => void;
  /** true면 선행 작업 미완료 상태 — 서류 목록 대신 안내 문구만 표시하고 체크 불가 */
  locked?: boolean;
  /** 서류 카드의 "파일 업로드" 버튼 클릭 시 호출 — Document Upload Modal을 여는 용도 */
  onOpenUpload?: (taskDocumentId: number) => void;
  /** 촬영 자동 체크 성공 또는 수동 체크 시 호출 — PATCH /api/v1/task-documents/{taskDocumentId}/check */
  onCheck?: (taskDocumentId: number) => void;
  /** true면 이미 완료된 행동형 태스크 — "완료로 표시" 버튼 대신 완료 상태를 보여줌 */
  isCompleted?: boolean;
  /**
   * 서류가 없는 행동형 태스크의 "완료로 표시" 핸들러 — PATCH /api/v1/tasks/{taskId}/complete.
   * 태스크 완료는 되돌릴 수 없는 설계라 취소 동작은 없다(서류 체크와 달리 토글이 아님).
   */
  onComplete?: () => void;
  /** 완료 요청 진행 중이면 버튼을 막아 중복 호출을 방지 */
  isCompleting?: boolean;
  /** 서류 카드 색을 결정하는 태스크 일정 상태 (일정 추가 전/마감 전/오늘/기간 지남) */
  scheduleState?: DocumentScheduleState;
};

export default function DocumentTaskDetailModal({
  category,
  title,
  infoBanner,
  documents,
  onClose,
  dDayLabel,
  scheduledDate,
  onDateClick,
  editableTitle = false,
  onTitleChange,
  onAddSchedule,
  locked = false,
  onOpenUpload,
  onCheck,
  isCompleted = false,
  onComplete,
  isCompleting = false,
  scheduleState = 'scheduled',
}: DocumentTaskDetailModalProps) {
  const completedCount = documents.filter((d) => d.isChecked).length;
  const totalCount = documents.length;
  const hasDocuments = totalCount > 0;
  const progressPercent = hasDocuments ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex max-h-[85vh] w-[800px] max-w-[90vw] flex-col gap-[46px] overflow-y-auto rounded-5 bg-white px-11 pb-[60px] pt-10">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {dDayLabel && (
                <span className="body-05 rounded-md bg-primary-100 px-3 py-1 text-primary-600">{dDayLabel}</span>
              )}
              <span className="body-05 rounded-md bg-primary-50 px-3 py-1 text-primary-700">{category}</span>
            </div>

            {scheduledDate && (
              <button
                type="button"
                className="body-02 flex items-center gap-2 rounded-2 px-2 py-1 text-gray-700 transition-colors hover:bg-gray-50"
                onClick={onDateClick}
              >
                <CalendarIcon className="size-icon-sm" />
                {scheduledDate}
              </button>
            )}

            <div className="flex items-center gap-2">
              {editableTitle ? (
                <input
                  type="text"
                  className="heading-04 w-[500px] text-gray-900 outline-none"
                  value={title}
                  onChange={(e) => onTitleChange?.(e.target.value)}
                />
              ) : (
                <p className="heading-04 text-gray-900">{title}</p>
              )}
              {editableTitle && <EditIcon className="size-icon-md text-gray-600" />}
            </div>
          </div>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-gray-700"
            onClick={onClose}
            aria-label="닫기"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-icon-md" aria-hidden>
              <path d="M19 5L5 19M5 5L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <hr className="border-gray-100" />
        <div className="body-03 rounded-3 border border-primary-100 bg-primary-50 px-10 py-5 text-primary-500">
          {infoBanner}
        </div>
      </div>

      {locked ? (
        <p className="body-02 flex items-center gap-1 text-red-500">
          <WarningIcon className="size-icon-sm" />
          선행 작업을 먼저 완료해주세요
        </p>
      ) : (
        <div className="flex w-full flex-col items-end gap-5">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="title-01 flex items-center justify-between">
                <p className="heading-06 text-gray-900">할 일</p>
                {hasDocuments ? (
                  <span className="title-02 text-primary-500">
                    {completedCount}/{totalCount} 완료
                  </span>
                ) : (
                  // 서류가 하나도 없으면 진행률 대신 아직 할 일이 없다는 것을 같은 자리에 알려준다
                  <span className="body-05 rounded-md bg-gray-100 px-3 py-1 text-gray-500">할 일 추가 필요</span>
                )}
              </div>
              {/* 서류가 없으면 채울 진행률도 없으므로 빈 막대만 남긴다 */}
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                {hasDocuments && (
                  <div className="h-full rounded-full bg-primary-500" style={{ width: `${progressPercent}%` }} />
                )}
              </div>
            </div>

            {hasDocuments ? (
              <div className="flex flex-col gap-3">
                {documents.map((document) => (
                  <RequiredDocumentCard
                    key={document.taskDocumentId}
                    document={document}
                    scheduleState={scheduleState}
                    onOpenUpload={() => onOpenUpload?.(document.taskDocumentId)}
                    onCheck={() => onCheck?.(document.taskDocumentId)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex w-full flex-col items-center gap-5 py-10">
                <p className="body-02 text-gray-500">제출 서류 없는 단계</p>
                {isCompleted ? (
                  <span className="title-03 text-primary-500">완료된 작업이에요</span>
                ) : (
                  <div className="w-60">
                    <LargeFillButton
                      label="완료로 표시"
                      onClick={onComplete}
                      // 핸들러가 없으면 눌러도 아무 일이 없고, 요청 중이면 중복 호출되므로 둘 다 막는다
                      disabled={!onComplete || isCompleting}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {onAddSchedule && (
            <button
              type="button"
              className="body-04 flex items-center gap-1 rounded-2 bg-gray-20 py-1.5 pl-4 pr-5 text-gray-500 transition-colors hover:bg-gray-50"
              onClick={onAddSchedule}
            >
              <PlusScheduleIcon className="size-icon-md" />
              일정 추가하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
