import AlertCircleIcon from '../../../shared/components/AlertCircleIcon';

type DeleteRoadmapModalProps = {
  cityName: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function DeleteRoadmapModal({ cityName, onCancel, onConfirm }: DeleteRoadmapModalProps) {
  return (
    <div className="flex w-[420px] flex-col items-center gap-6 rounded-4 bg-white p-8 shadow-02">
      <div className="flex flex-col items-center gap-2">
        <AlertCircleIcon className="size-icon-xl" />
        <p className="heading-06 text-gray-900">{cityName} 로드맵을 삭제할까요?</p>
        <p className="body-03 text-gray-500">삭제된 정보는 다시 복구할 수 없어요.</p>
      </div>

      <div className="flex w-full flex-col gap-1 rounded-3 bg-gray-20 px-5 py-4">
        <p className="body-04 text-gray-700">삭제 전 확인해 주세요.</p>
        <p className="body-04 text-gray-500">
          로드맵을 삭제하면 지금까지 설정한 일정, 완료한 준비 항목, 예산 계획 정보가 모두 삭제돼요.
        </p>
        <p className="body-04 text-gray-500">계속 진행하려면 삭제하기 버튼을 눌러 주세요.</p>
      </div>

      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="title-03 flex-1 rounded-2 bg-gray-100 py-3 text-gray-700"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="title-03 flex-1 rounded-2 bg-red-500 py-3 text-white"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}
