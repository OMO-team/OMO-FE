import DocumentDoneIcon from './icons/DocumentDoneIcon';
import type { RequiredDocumentData } from '../types/roadmap';

type RequiredDocumentCardProps = {
  document: RequiredDocumentData;
  /** 원을 눌러 서류를 완료로 표시할 때 호출 — PATCH /api/v1/task-documents/{id}/check */
  onCheck?: () => void;
};

/**
 * 카드는 수행 여부만으로 갈린다.
 * 마감일 정보는 태스크 모달 헤더(D-day·날짜)에 이미 있고, 한 태스크의 서류는 마감일을 공유해서
 * 카드마다 같은 색을 반복하게 되므로 시안에서 일정 상태 구분이 빠졌다.
 */
export default function RequiredDocumentCard({ document, onCheck }: RequiredDocumentCardProps) {
  const isDone = document.isChecked;

  return (
    <div
      className={`rounded-3 border px-4 pb-4 pt-5 transition-colors ${
        isDone
          ? // 완료 hover 배경(#dceeff)은 primary-50과 100 사이 값이라 대응하는 토큰이 없어 그대로 씀
            'border-primary-200 bg-primary-50 hover:bg-[#dceeff]'
          : 'border-gray-100 bg-white hover:bg-gray-20'
      }`}
    >
      <div className="flex items-start gap-2">
        {isDone ? (
          // 완료는 되돌릴 수 없어서 체크된 뒤에는 누를 수 없는 아이콘으로 둔다
          <DocumentDoneIcon className="size-icon-lg shrink-0 text-primary-500" />
        ) : (
          <button
            type="button"
            onClick={onCheck}
            disabled={!onCheck}
            aria-label={`${document.name} 완료로 표시`}
            className="size-icon-lg shrink-0 rounded-full border-2 border-primary-200 transition-colors disabled:cursor-not-allowed not-disabled:hover:border-primary-500"
          />
        )}
        <div className="flex flex-1 flex-col gap-2">
          <p className="title-02 text-gray-900">{document.name}</p>
          {document.subtitle && <p className="body-03 text-gray-500">{document.subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
