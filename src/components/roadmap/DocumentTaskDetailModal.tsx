import CalendarIcon from './icons/CalendarIcon';
import EditIcon from './icons/EditIcon';
import PlusScheduleIcon from './icons/PlusScheduleIcon';
import WarningIcon from './icons/WarningIcon';
import RequiredDocumentCard from './RequiredDocumentCard';
import type { RequiredDocumentData } from '../types/roadmap';

type DocumentTaskDetailModalProps = {
  category: string;
  title: string;
  infoBanner: string;
  completedCount: number;
  totalCount: number;
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
  /** 지정하면 하단에 "+ 일정 추가하기" 버튼 표시 */
  onAddSchedule?: () => void;
  /** true면 선행 작업 미완료 상태 — 서류 목록 대신 안내 문구만 표시하고 체크 불가 */
  locked?: boolean;
  /** 서류 카드의 "파일 업로드" 버튼 클릭 시 호출 (document.name) — Document Upload Modal을 여는 용도 */
  onOpenUpload?: (documentName: string) => void;
};

export default function DocumentTaskDetailModal({
  category,
  title,
  infoBanner,
  completedCount,
  totalCount,
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
}: DocumentTaskDetailModalProps) {
  const progressPercent = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

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
                className="body-02 flex items-center gap-2 rounded-2 px-2 py-1 text-gray-700"
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
                <p className="heading-06 text-black">서류 목록</p>
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
                  key={document.name}
                  document={document}
                  onOpenUpload={() => onOpenUpload?.(document.name)}
                />
              ))}
            </div>
          </div>

          {onAddSchedule && (
            <button
              type="button"
              className="body-04 flex items-center gap-1 rounded-2 bg-gray-20 py-1.5 pl-4 pr-5 text-gray-500"
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
