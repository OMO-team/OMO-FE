import LocationPinIcon from './LocationPinIcon';
import ChevronDownIcon from './ChevronDownIcon';

type CountryGroupHeaderProps = {
  countryName: string;
  cityCount: number;
  isExpanded?: boolean;
  onToggle?: () => void;
};

export default function CountryGroupHeader({
  countryName,
  cityCount,
  isExpanded = false,
  onToggle,
}: CountryGroupHeaderProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-4 bg-gray-50 px-6 py-3"
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <LocationPinIcon className="size-icon-lg text-primary-800" />
        <span className="title-01 text-primary-800">{countryName}</span>
        <span className="body-05 rounded-md bg-primary-50 px-3 py-1 text-primary-700">{cityCount}개 도시</span>
      </div>
      <ChevronDownIcon
        className={`size-icon-sm text-gray-500 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
      />
    </button>
  );
}
