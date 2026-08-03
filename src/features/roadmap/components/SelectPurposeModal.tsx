import { useQuery } from '@tanstack/react-query';
import { purposesApi } from '../api/purposesApi';
import { purposeQueryKeys } from '../api/queryKeys';

type SelectPurposeModalProps = {
  cityName: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onSelectPurpose: (purposeId: number) => void;
  onClose?: () => void;
};

export default function SelectPurposeModal({
  cityName,
  isSubmitting,
  errorMessage,
  onSelectPurpose,
  onClose,
}: SelectPurposeModalProps) {
  const { data: purposes = [], isLoading } = useQuery({
    queryKey: purposeQueryKeys.list,
    queryFn: purposesApi.list,
  });

  return (
    <div className="flex w-[460px] flex-col items-center gap-8 rounded-4 bg-white px-10 py-[50px]">
      <div className="flex flex-col items-center gap-2">
        <p className="heading-05 text-black">
          <span className="text-primary-500">{cityName}</span>에서 어떤 준비를 시작할까요?
        </p>
        <p className="body-02 text-gray-500">목적을 선택하면 맞춤 로드맵이 만들어져요.</p>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        {isLoading ? (
          <p className="body-02 py-6 text-center text-gray-400">목적 목록을 불러오는 중이에요.</p>
        ) : (
          purposes.map((purpose) => (
            <button
              key={purpose.purposeId}
              type="button"
              disabled={isSubmitting}
              onClick={() => onSelectPurpose(purpose.purposeId)}
              className="title-02 w-full rounded-2 border border-gray-200 py-4 text-gray-700 transition-colors hover:border-primary-500 hover:text-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {purpose.name}
            </button>
          ))
        )}
      </div>

      {errorMessage && <p className="body-04 w-full text-center text-red-500">{errorMessage}</p>}

      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="title-02 h-[46px] w-full rounded-2 bg-gray-100 text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        취소
      </button>
    </div>
  );
}
