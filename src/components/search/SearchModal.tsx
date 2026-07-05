import searchIcon from '../../assets/icons/icon-search[18].svg';
import closeIcon from '../../assets/icons/icon-close[14].svg';
import trashIcon from '../../assets/icons/icon-trash.svg';

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
      className="flex flex-col items-center w-[1440px] bg-white"
      style={{ height: '496px' }}
      role="dialog"
      aria-modal="true"
    >
      {/* L_Search Header */}
      <div className="flex flex-col items-center w-[1440px]">
        <div className="flex w-[1064px] px-5 pt-9 pb-6 justify-between items-center">
          <div className="flex items-center gap-[57px] flex-1">
            <div className="flex justify-center items-center w-6 h-6 flex-shrink-0">
              <img src={searchIcon} alt="검색" className="w-[18px] h-[18px]" />
            </div>
            <input
              type="text"
              className="flex-1 outline-none text-gray-900 placeholder:text-gray-500 bg-transparent body-02"
              placeholder="도시나 키워드로 검색하기"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex justify-center items-center w-6 h-6 flex-shrink-0"
          >
            <img src={closeIcon} alt="닫기" className="w-[14px] h-[14px]" />
          </button>
        </div>
        <div className="w-[1440px] h-px bg-gray-100" />
      </div>

      {/* L_Search Content */}
      <div className="flex flex-col items-center w-[1064px]">
        <div className="flex pt-10 px-5 pb-0 justify-between items-center self-stretch">
          <span className="heading-06 text-gray-900">최근 검색어</span>
          {hasSearches && (
            <button type="button" onClick={onClearAll} className="flex items-center gap-1">
              <div className="flex justify-center items-center w-6 h-6">
                <img src={trashIcon} alt="삭제" className="flex-shrink-0" style={{ width: '17.412px', height: '18.5px' }} />
              </div>
              <span className="body-03 text-gray-500">전체 삭제</span>
            </button>
          )}
        </div>

        {hasSearches ? (
          <div className="flex flex-col items-start w-full mt-4">
            {recentSearches.map((query, i) => (
              <div key={i} className="flex w-[1064px] px-5 py-5 items-center gap-1">
                <span
                  className={`flex-1 overflow-hidden body-02 ${i === 0 ? 'text-gray-600' : 'text-gray-700'}`}
                  style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, textOverflow: 'ellipsis' }}
                >
                  {query}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove?.(i)}
                  className="flex-shrink-0"
                  style={{ width: '16px', height: '16px' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1l8 8M9 1L1 9" stroke="#6B7A94" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="self-stretch text-center mt-[60px] body-01 text-gray-500">
            최근 검색어가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
