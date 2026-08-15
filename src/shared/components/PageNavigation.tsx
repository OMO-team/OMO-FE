import ChevronLeftIcon from './icons/ChevronLeftIcon';

const GROUP_SIZE = 10;

type PageNavigationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

export default function PageNavigation({
  currentPage,
  totalPages,
  onPageChange,
}: PageNavigationProps) {
  if (totalPages <= 0) return null;

  const currentGroup = Math.floor((currentPage - 1) / GROUP_SIZE);
  const totalGroups = Math.ceil(totalPages / GROUP_SIZE);

  const groupStart = currentGroup * GROUP_SIZE + 1;
  const groupEnd = Math.min(groupStart + GROUP_SIZE - 1, totalPages);
  const visiblePages = Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i);

  const handlePrev = () => {
    if (currentGroup <= 0) return;
    onPageChange?.((currentGroup - 1) * GROUP_SIZE + 1);
  };

  const handleNext = () => {
    if (currentGroup >= totalGroups - 1) return;
    onPageChange?.((currentGroup + 1) * GROUP_SIZE + 1);
  };

  return (
    <div className="flex w-full max-w-full items-center justify-center gap-2">
      <button
        type="button"
        className="flex shrink-0 size-icon-sm items-center justify-center text-gray-600 disabled:opacity-40"
        aria-label="이전 페이지 그룹"
        disabled={currentGroup <= 0}
        onClick={handlePrev}
      >
        <ChevronLeftIcon className="size-icon-sm" />
      </button>
      <div className="flex min-w-0 items-center gap-1 overflow-x-auto sm:gap-3">
        {visiblePages.map(page => (
          <button
            key={page}
            type="button"
            className={`title-02 flex shrink-0 flex-col items-center justify-center rounded-2 px-2.5 py-2 sm:px-3.5 ${
              page === currentPage ? 'bg-primary-50 text-primary-500' : 'text-gray-600'
            }`}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="flex shrink-0 size-icon-sm items-center justify-center text-gray-600 disabled:opacity-40"
        aria-label="다음 페이지 그룹"
        disabled={currentGroup >= totalGroups - 1}
        onClick={handleNext}
      >
        <ChevronLeftIcon className="size-icon-sm rotate-180" />
      </button>
    </div>
  );
}
