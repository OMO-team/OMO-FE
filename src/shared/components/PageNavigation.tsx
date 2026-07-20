type PageNavigationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

export default function PageNavigation({ currentPage, totalPages, onPageChange }: PageNavigationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center gap-3">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`title-02 flex flex-col items-center justify-center rounded-2 px-3.5 py-2 ${
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
        className="flex size-icon-sm items-center justify-center text-gray-600"
        aria-label="다음 페이지"
        onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
      >
        〉
      </button>
    </div>
  );
}
