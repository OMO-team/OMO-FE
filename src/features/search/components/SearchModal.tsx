import searchIcon from '../../../assets/icons/icon-search[18].svg';
import closeIcon from '../../../assets/icons/icon-close[14].svg';
import trashIcon from '../../../assets/icons/icon-trash.svg';

type SearchModalProps = {
  onClose: () => void;
  recentSearches?: string[];
  onRemove?: (index: number) => void;
  onClearAll?: () => void;
};

export default function SearchModal({
  onClose,
  recentSearches = [],
  onRemove,
  onClearAll,
}: SearchModalProps) {
  const hasSearches = recentSearches.length > 0;

  return (
    <div
      className="flex h-[496px] w-[1440px] flex-col items-center bg-white"
      role="dialog"
      aria-modal="true"
    >
      {/* L_Search Header */}
      <div className="flex w-[1440px] flex-col items-center">
        <div className="flex w-[1064px] items-center justify-between px-5 pb-6 pt-9">
          <div className="flex flex-1 items-center gap-[57px]">
            <div className="flex size-6 shrink-0 items-center justify-center">
              <img src={searchIcon} alt="검색" className="size-[18px]" />
            </div>
            <input
              type="text"
              className="body-02 flex-1 bg-transparent outline-none placeholder:text-gray-500"
              placeholder="도시나 키워드로 검색하기"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-6 shrink-0 items-center justify-center"
          >
            <img src={closeIcon} alt="닫기" className="size-[14px]" />
          </button>
        </div>
        <div className="h-px w-[1440px] bg-gray-100" />
      </div>

      {/* L_Search Content */}
      <div className="flex w-[1064px] flex-col items-center">
        <div className="flex items-center justify-between self-stretch px-5 pb-0 pt-10">
          <span className="heading-06 text-gray-900">최근 검색어</span>
          {hasSearches && (
            <button type="button" onClick={onClearAll} className="flex items-center gap-1">
              <div className="flex size-6 items-center justify-center">
                <img src={trashIcon} alt="삭제" className="h-[18px] w-[17px] shrink-0" />
              </div>
              <span className="body-03 text-gray-500">전체 삭제</span>
            </button>
          )}
        </div>

        {hasSearches ? (
          <div className="mt-4 flex w-full flex-col items-start">
            {recentSearches.map((query, i) => (
              <div key={i} className="flex w-[1064px] items-center gap-1 px-5 py-5">
                <span
                  className={`body-02 line-clamp-1 flex-1 overflow-hidden text-ellipsis ${i === 0 ? 'text-gray-600' : 'text-gray-700'}`}
                >
                  {query}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove?.(i)}
                  className="size-4 shrink-0"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1l8 8M9 1L1 9" stroke="#6B7A94" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="body-01 mt-[60px] self-stretch text-center text-gray-500">
            최근 검색어가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
