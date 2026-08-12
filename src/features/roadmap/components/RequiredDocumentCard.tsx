import CloudUploadIcon from './icons/CloudUploadIcon';
import DocumentDoneIcon from './icons/DocumentDoneIcon';
import FileClipIcon from './icons/FileClipIcon';
import RemoveIcon from './icons/RemoveIcon';
import type { RequiredDocumentData } from '../types/roadmap';

/**
 * 카드 색과 아이콘은 서류 체크 여부만이 아니라 태스크의 일정 상태에 따라서도 달라진다.
 * - unscheduled: 일정 추가 전(마감일 없음) — 흰 배경에 제목까지 흐리게
 * - scheduled: 마감일이 아직 남음
 * - today: 오늘이 마감일 — 체크·처리 중이면 파랗게 강조
 * - overdue: 마감일이 지남 — 전체를 회색으로 죽이고 완료된 서류는 취소선
 */
export type DocumentScheduleState = 'unscheduled' | 'scheduled' | 'today' | 'overdue';

type RequiredDocumentCardProps = {
  document: RequiredDocumentData;
  onOpenUpload?: () => void;
  /** 원을 눌러 서류를 완료로 표시할 때 호출 — PATCH /api/v1/task-documents/{id}/check */
  onCheck?: () => void;
  /** 파일 칩의 X를 눌렀을 때 호출 */
  onRemoveFile?: (fileName: string) => void;
  /** 속한 태스크의 일정 상태 — 지정하지 않으면 일정이 잡힌 것으로 본다 */
  scheduleState?: DocumentScheduleState;
};

export default function RequiredDocumentCard({
  document,
  onOpenUpload,
  onCheck,
  onRemoveFile,
  scheduleState = 'scheduled',
}: RequiredDocumentCardProps) {
  const isDone = document.isChecked;

  const isOverdue = scheduleState === 'overdue';
  const isUnscheduled = scheduleState === 'unscheduled';
  /** 기간이 지나지 않은 상태에서 체크됐으면 파란 카드로 강조 */
  const isHighlighted = !isOverdue && !isUnscheduled && isDone;

  return (
    <div
      className={`rounded-3 border px-4 pb-4 pt-5 transition-colors ${
        isOverdue
          ? 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-100'
          : isHighlighted
            ? // hover 배경(#d2eaff)은 primary-100과 200 사이 값이라 대응하는 토큰이 없어 그대로 씀
              'border-primary-200 bg-primary-50 hover:bg-[#d2eaff]'
            : 'border-gray-100 bg-white hover:bg-gray-20'
      }`}
    >
      <div className="flex items-start gap-2">
        {isDone ? (
          // 완료는 되돌릴 수 없어서 체크된 뒤에는 누를 수 없는 아이콘으로 둔다
          <DocumentDoneIcon
            className={`size-icon-lg shrink-0 ${isOverdue ? 'text-gray-300' : 'text-primary-500'}`}
          />
        ) : (
          // 원을 누르면 서류가 완료로 바뀐다. 기간이 지났어도 체크할 수 있다.
          <button
            type="button"
            onClick={onCheck}
            disabled={!onCheck}
            aria-label={`${document.name} 완료로 표시`}
            className={`size-icon-lg shrink-0 rounded-full transition-colors disabled:cursor-not-allowed ${
              // 일정이 잡혔지만 아직 안 한 서류는 테두리 대신 옅은 파란 원으로 표시
              scheduleState === 'scheduled'
                ? 'bg-primary-200 not-disabled:hover:bg-primary-300'
                : 'border-2 border-gray-300 not-disabled:hover:border-primary-500'
            }`}
          />
        )}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`title-02 ${isUnscheduled ? 'text-gray-500' : 'text-gray-900'} ${
                // 기간이 지난 뒤 완료된 서류는 지나간 일이라는 뜻으로 취소선을 긋는다
                isOverdue && isDone ? 'line-through' : ''
              }`}
            >
              {document.name}
            </p>
            <button
              type="button"
              onClick={onOpenUpload}
              aria-label="파일 업로드"
              className="shrink-0 text-primary-300"
            >
              <CloudUploadIcon className="size-icon-md" />
            </button>
          </div>
          {document.subtitle && <p className="body-03 text-gray-500">{document.subtitle}</p>}

          {isDone && document.uploadedFiles && document.uploadedFiles.length > 0 && (
            // 파일 목록만 위 간격이 16px — 카드 세로 간격(8px)에 8px을 더해 맞춘다
            <div className="mt-2 flex flex-col gap-2">
              {document.uploadedFiles.map((fileName) => (
                <div
                  key={fileName}
                  // 파란 칩 배경(#d2eaff)과 hover(#c3e3ff)는 primary-100과 200 사이 값이라 대응하는 토큰이 없어 그대로 씀
                  className={`flex h-7.25 items-center justify-between gap-2 rounded-md px-2 py-1 transition-colors ${
                    isOverdue ? 'bg-gray-100 hover:bg-gray-200' : 'bg-[#d2eaff] hover:bg-[#c3e3ff]'
                  }`}
                >
                  <span
                    className={`body-03 flex items-center gap-2 truncate ${
                      isOverdue ? 'text-gray-500' : 'text-primary-600'
                    }`}
                  >
                    <FileClipIcon className="size-icon-sm shrink-0" />
                    <span className="truncate">{fileName}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveFile?.(fileName)}
                    disabled={!onRemoveFile}
                    aria-label={`${fileName} 삭제`}
                    className={`shrink-0 rounded-full transition-opacity disabled:cursor-not-allowed not-disabled:hover:opacity-70 ${
                      isOverdue ? 'text-gray-500' : 'text-primary-600'
                    }`}
                  >
                    <RemoveIcon className="size-icon-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
