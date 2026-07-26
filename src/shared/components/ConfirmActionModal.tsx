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
}: ConfirmActionModalProps) {
  return (
    <div className="flex w-[590px] flex-col items-center gap-[30px] rounded-4 bg-white px-12 pb-[50px] pt-[60px]">
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <span className="flex size-[70px] items-center justify-center rounded-full bg-red-50">
            <AlertCircleIcon className="size-icon-xl" />
          </span>
          <div className="flex w-[344px] flex-col items-center gap-2">
            <p className="heading-05 text-black">{title}</p>
            <div className="body-01 flex flex-col items-center text-gray-700">
              {description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-1 rounded-4 bg-gray-50 px-10 py-8">
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
          className="title-02 h-[46px] w-[158px] shrink-0 rounded-2 bg-gray-100 text-gray-600"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="title-02 h-[46px] flex-1 rounded-2 bg-red-500 text-white"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
