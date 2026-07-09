import MinusIcon from './icons/MinusIcon';
import PlusIcon from './icons/PlusIcon';

type RFillButtonGrayPlanProps = {
  months: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
};

export default function RFillButtonGrayPlan({ months, onIncrement, onDecrement }: RFillButtonGrayPlanProps) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2 bg-gray-20 px-4 py-3 text-gray-900">
      <button type="button" className="size-icon-sm" aria-label="개월 수 감소" onClick={onDecrement}>
        <MinusIcon className="size-icon-sm" />
      </button>
      <span className="title-02 min-w-[60px] text-center text-gray-900">{months}개월</span>
      <button type="button" className="size-icon-sm" aria-label="개월 수 증가" onClick={onIncrement}>
        <PlusIcon className="size-icon-sm" />
      </button>
    </div>
  );
}
