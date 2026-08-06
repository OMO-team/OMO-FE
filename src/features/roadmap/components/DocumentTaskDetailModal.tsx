import CalendarIcon from './icons/CalendarIcon';
import EditIcon from './icons/EditIcon';
import NoteInfoIcon from './icons/NoteInfoIcon';
import WarningIcon from './icons/WarningIcon';
import RequiredDocumentCard, { type DocumentScheduleState } from './RequiredDocumentCard';
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
  /**
   * true면 제목을 입력 가능한 필드로 표시 (연필 아이콘 + 클릭해서 수정).
   * 이름 변경 API가 아직 없어 현재는 켜지 않는다 — 엔드포인트가 생기면 켜면 된다.
   */
  editableTitle?: boolean;
  onTitleChange?: (title: string) => void;
  /** true면 선행 작업 미완료 상태 — 서류 목록 대신 안내 문구만 표시하고 체크 불가 */
  locked?: boolean;
  /** 서류 카드의 "파일 업로드" 버튼 클릭 시 호출 — Document Upload Modal을 여는 용도 */
  onOpenUpload?: (taskDocumentId: number) => void;
  /** 서류 카드의 원을 눌러 완료로 표시할 때 호출 — PATCH /api/v1/task-documents/{taskDocumentId}/check */
  onCheck?: (taskDocumentId: number) => void;
  /** 서류에 붙은 파일 칩의 X를 눌렀을 때 호출 */
  onRemoveFile?: (taskDocumentId: number, fileName: string) => void;
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
  locked = false,
  onOpenUpload,
  onCheck,
  onRemoveFile,
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
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-0.5">
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-2 pl-2">
                {dDayLabel && (
                  <span className="body-05 rounded-md bg-primary-100 px-3 py-1 text-primary-600">{dDayLabel}</span>
                )}
                <span className="body-05 rounded-md bg-primary-50 px-3 py-1 text-primary-700">{category}</span>
              </div>

              {/* 날짜와 제목은 한 덩어리로 붙여 둔다 (시안 기준 4px) */}
              <div className="flex flex-col items-start gap-1">
                {scheduledDate && (
                  <button
                    type="button"
                    className="body-03 flex items-center gap-2 rounded-2 py-1 pl-2 pr-2.5 text-gray-700 transition-colors hover:bg-gray-50"
                    onClick={onDateClick}
                  >
                    <CalendarIcon className="size-icon-sm" />
                    {scheduledDate}
                  </button>
                )}

                <div className="flex items-center gap-2.5 pl-2">
                  {editableTitle ? (
                    <input
                      type="text"
                      // 제목 옆에 연필 아이콘이 바로 붙어야 해서 입력폭을 내용에 맞춘다
                      className="heading-04 min-w-40 field-sizing-content text-gray-900 outline-none"
                      value={title}
                      onChange={(e) => onTitleChange?.(e.target.value)}
                      aria-label="태스크 이름"
                    />
                  ) : (
                    <p className="heading-04 text-gray-900">{title}</p>
                  )}
                  {editableTitle && <EditIcon className="size-icon-md shrink-0 text-gray-600" />}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-50"
              onClick={onClose}
              aria-label="닫기"
            >
              <svg viewBox="0 0 24 24" fill="none" className="size-icon-md" aria-hidden>
                <path d="M19 5L5 19M5 5L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <hr className="border-gray-100" />
        </div>
        <div className="body-03 flex items-center justify-center gap-1 rounded-3 border border-primary-100 bg-primary-50 p-5 text-primary-500">
          {/* 시안 기준 24px 아이콘 박스 안에 19.5×21.5 글리프 */}
          <span className="flex size-icon-md shrink-0 items-center justify-center">
            <NoteInfoIcon className="h-[21.5px] w-[19.5px]" />
          </span>
          {infoBanner}
        </div>
      </div>

      {locked ? (
        <p className="body-02 flex items-center gap-1 text-red-500">
          <WarningIcon className="size-icon-sm" />
          선행 작업을 먼저 완료해주세요
        </p>
      ) : hasDocuments ? (
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="title-01 flex items-center justify-between">
              <p className="heading-06 text-gray-900">할 일</p>
              <span className="title-02 text-primary-500">
                {completedCount}/{totalCount} 완료
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-primary-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {documents.map((document) => (
              <RequiredDocumentCard
                key={document.taskDocumentId}
                document={document}
                scheduleState={scheduleState}
                onOpenUpload={() => onOpenUpload?.(document.taskDocumentId)}
                onCheck={() => onCheck?.(document.taskDocumentId)}
                onRemoveFile={
                  onRemoveFile ? (fileName) => onRemoveFile(document.taskDocumentId, fileName) : undefined
                }
              />
            ))}
          </div>
        </div>
      ) : (
        /* 서류가 없는 태스크는 할 일 목록 대신 완료 버튼만 가운데에 둔다 */
        <div className="flex w-full max-w-[562px] flex-col items-center gap-13.5 self-center py-10">
          <div className="body-01 flex flex-col items-center gap-1 text-center text-gray-800">
            <p>별도의 서류 등록 없이 완료 처리를 할 수 있어요.</p>
            <p>
              <span className="title-05 text-primary-500">{title}</span>을 완료했다면 아래 버튼을 눌러 주세요.
            </p>
          </div>
          {/* 이미 완료했거나 요청 중이면 눌리지 않는 회색 버튼으로 둔다 (완료는 되돌릴 수 없음) */}
          <button
            type="button"
            onClick={onComplete}
            disabled={isCompleted || !onComplete || isCompleting}
            className="title-02 h-12 w-[282px] rounded-2 bg-primary-500 text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isCompleted ? '완료됨' : '완료'}
          </button>
        </div>
      )}
    </div>
  );
}
