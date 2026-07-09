import CloseButton from "../common/CloseButton";
import StarIcon from "../common/StarIcon";

interface CityReportHeaderProps {
  ratingBadge: number;
  onClose: () => void;
}

export default function CityReportHeader({
  ratingBadge,
  onClose,
}: CityReportHeaderProps) {
  return (
    <div className="flex justify-between items-center self-stretch relative">
      <div className="flex justify-start items-center gap-1">
        <div className="flex justify-center items-center gap-1 px-3 py-1.5 rounded-2 bg-primary-500">
          <p className="body-02 text-white">AI 리포트</p>
        </div>
        <div className="flex justify-center items-center h-8 gap-0.5 pl-2.5 pr-3 py-1 rounded-2 bg-primary-900/30">
          <StarIcon size={16} className="size-icon-xs text-white" />
          <p className="body-02 text-white">{ratingBadge}</p>
        </div>
      </div>
      <CloseButton onClick={onClose} />
    </div>
  );
}
