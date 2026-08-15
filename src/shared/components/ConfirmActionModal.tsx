import type { ReactNode } from 'react';
import AlertCircleIcon from './AlertCircleIcon';

type ConfirmActionModalProps = {
  title: string;
  description: string[];
  infoTitle: string;
  infoDetail: string[];
  cancelLabel: string;
  confirmLabel: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  /** 되돌릴 수 없는 삭제는 danger(빨강), 그 외 일반 확인은 primary(파랑) */
  tone?: 'danger' | 'primary';
  /** 원 안에 넣을 아이콘 — 지정하지 않으면 경고 아이콘 */
  icon?: ReactNode;
  /** 확인 버튼을 잠시 막아야 할 때 (요청 중 중복 클릭 방지) */
  isConfirmDisabled?: boolean;
};

export default function ConfirmActionModal({
  title,
  description,
  infoTitle,
  infoDetail,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  tone = 'danger',
  icon,
  isConfirmDisabled = false,
}: ConfirmActionModalProps) {
  const isPrimary = tone === 'primary';
  return (
    <div className="flex w-full max-w-[590px] flex-col items-center gap-[30px] rounded-4 bg-white px-[clamp(20px,8vw,48px)] pb-[50px] pt-[60px]">
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <span
            className={`flex size-[70px] shrink-0 items-center justify-center rounded-full ${
              isPrimary ? 'bg-primary-50' : 'bg-red-50'
            }`}
          >
            {icon ?? <AlertCircleIcon className="size-icon-xl" />}
          </span>
          <div className="flex w-full max-w-[344px] flex-col items-center gap-2">
            <p className="heading-05 text-black">{title}</p>
            <div className="body-01 flex flex-col items-center text-gray-700">
              {description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-1 rounded-4 bg-gray-50 px-[clamp(16px,6vw,40px)] py-8">
          <p className="body-02 text-gray-500">{infoTitle}</p>
          <div className="body-04 flex flex-col items-start text-gray-500">
            {infoDetail.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full items-start justify-center gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="title-02 h-[46px] w-full max-w-[158px] shrink-0 rounded-2 bg-gray-100 text-gray-600"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirmDisabled}
          className={`title-02 h-[46px] flex-1 rounded-2 text-white disabled:cursor-not-allowed disabled:bg-gray-300 ${
            isPrimary ? 'bg-primary-500' : 'bg-red-500'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
