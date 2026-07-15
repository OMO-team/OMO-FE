import backArrowIcon from "../../assets/icons/back-arrow.svg";

interface BackHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function BackHeader({ title, onBack }: BackHeaderProps) {
  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로가기"
        className="flex size-icon-lg items-center justify-center"
      >
        <img src={backArrowIcon} alt="" className="size-icon-md" />
      </button>
      <h1 className="heading-05 text-gray-900">{title}</h1>
    </div>
  );
}
