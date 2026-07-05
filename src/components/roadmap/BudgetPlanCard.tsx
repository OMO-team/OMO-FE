import MoneyIcon from './icons/MoneyIcon';
import SFillButtonGrayPlan from './SFillButtonGrayPlan';
import RFillButtonGrayPlan from './RFillButtonGrayPlan';

const MONTH_PRESETS = [3, 6, 9, 12];

type BudgetPlanCardProps = {
  months: number;
  onSelectMonths?: (months: number) => void;
  onIncrementMonths?: () => void;
  onDecrementMonths?: () => void;
  initialSettlementCost: number;
  monthlyLivingCost: number;
  stayMonths: number;
  livingCostSubtotal: number;
  totalBudget: number;
};

export default function BudgetPlanCard({
  months,
  onSelectMonths,
  onIncrementMonths,
  onDecrementMonths,
  initialSettlementCost,
  monthlyLivingCost,
  stayMonths,
  livingCostSubtotal,
  totalBudget,
}: BudgetPlanCardProps) {
  return (
    <div className="flex w-[434px] flex-col items-center rounded-4 border border-gray-100 bg-white px-7 pb-[30px] pt-6">
      <div className="flex w-[358px] flex-col gap-10">
        <div className="flex items-center gap-1">
          <MoneyIcon className="size-icon-lg text-gray-900" />
          <p className="heading-05 text-black">예산 계획</p>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-2">
            <p className="body-02 text-gray-700">체류 기간</p>
            <div className="flex w-full items-center gap-2">
              {MONTH_PRESETS.map((preset) => (
                <SFillButtonGrayPlan
                  key={preset}
                  months={preset}
                  selected={preset === months}
                  onClick={() => onSelectMonths?.(preset)}
                />
              ))}
            </div>
            <RFillButtonGrayPlan months={months} onIncrement={onIncrementMonths} onDecrement={onDecrementMonths} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-start gap-5 rounded-2 bg-gray-20 px-5 pb-6 pt-5">
              <div className="flex w-full flex-col gap-4">
                <div className="body-02 flex w-full items-center justify-between text-gray-900">
                  <span className="text-gray-500">초기 정착금</span>
                  <span>{initialSettlementCost}만원</span>
                </div>
                <div className="body-02 flex w-full items-center justify-between text-gray-900">
                  <span className="text-gray-500">월 생활비</span>
                  <span>{monthlyLivingCost}만원</span>
                </div>
                <div className="body-02 flex w-full items-center justify-between text-gray-900">
                  <span className="text-gray-500">체류 기간</span>
                  <span>{stayMonths}개월</span>
                </div>
              </div>
              <hr className="w-full border-gray-100" />
              <div className="flex w-full items-center justify-between">
                <span className="body-02 text-gray-500">생활비 소계</span>
                <span className="title-05 text-gray-900">{livingCostSubtotal}만원</span>
              </div>
            </div>

            <div className="flex flex-col items-start rounded-2 bg-primary-50 px-5 py-4">
              <span className="body-05 text-gray-600">총 필요 예산</span>
              <span className="heading-06 text-primary-600">{totalBudget}만원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
