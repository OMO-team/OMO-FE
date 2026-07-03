type SFillButtonGrayPlanProps = {
  months: number;
  selected?: boolean;
  onClick?: () => void;
};

export default function SFillButtonGrayPlan({ months, selected = false, onClick }: SFillButtonGrayPlanProps) {
  return (
    <button
      type="button"
      className={`title-03 rounded-2 px-5 py-2 ${selected ? 'bg-primary-500 text-white' : 'bg-gray-20 text-gray-800'}`}
      onClick={onClick}
    >
      {months}개월
    </button>
  );
}
