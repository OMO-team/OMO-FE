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
        {/* Frame 10878 */}
        <div className="flex w-[1064px] px-5 pt-9 pb-6 justify-between items-center">

          {/* 검색 아이콘 + 인풋 (gap: 57px) */}
          <div className="flex items-center gap-[57px] flex-1">
            <div className="flex justify-center items-center w-6 h-6 flex-shrink-0">
              <img
                src="/src/assets/icons/Vector_search.svg"
                alt="검색"
                className="w-[18px] h-[18px]"
              />
            </div>
            <input
              type="text"
              className="flex-1 outline-none text-gray-900 placeholder:text-gray-500 bg-transparent"
              style={{
                fontFamily: 'Pretendard Variable',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '140%',
                letterSpacing: '-0.28px',
              }}
              placeholder="도시나 키워드로 검색하기"
            />
          </div>

          {/* 닫기 버튼 (14×14) */}
          <button
            type="button"
            onClick={onClose}
            className="flex justify-center items-center w-6 h-6 flex-shrink-0"
          >
            <img
              src="/src/assets/icons/Vector_X.svg"
              alt="닫기"
              className="w-[14px] h-[14px]"
            />
          </button>
        </div>

        {/* Divider */}
        <div className="w-[1440px] h-px bg-gray-100" />
      </div>

      {/* L_Search Content */}
      <div className="flex flex-col items-center w-[1064px]">

        {/* Section Title (Frame 10878) */}
        <div className="flex pt-10 px-5 pb-0 justify-between items-center self-stretch">
          <span
            style={{
              color: '#15181D',
              fontFamily: 'Pretendard Variable',
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '140%',
              letterSpacing: '-0.32px',
            }}
          >
            최근 검색어
          </span>

          {/* 휴지통 아이콘 + 전체 삭제 */}
          {hasSearches && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1"
            >
              {/* 휴지통 아이콘 (24×24 컨테이너) */}
              <div className="flex justify-center items-center w-6 h-6">
                <img
                  src="/src/assets/icons/Group.svg"
                  alt="삭제"
                  style={{ width: '17.412px', height: '18.5px', flexShrink: 0 }}
                />
              </div>
              <span
                style={{
                  color: '#6B7A94',
                  fontFamily: 'Pretendard Variable',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '150%',
                  letterSpacing: '-0.28px',
                }}
              >
                전체 삭제
              </span>
            </button>
          )}
        </div>

        {/* 검색어 목록 or 빈 상태 */}
        {hasSearches ? (
          /* Frame 10879: flex-col */
          <div className="flex flex-col items-start w-full mt-4">
            {recentSearches.map((query, i) => (
              <div
                key={i}
                className="flex w-[1064px] px-5 py-5 items-center gap-1"
              >
                {/* 검색어 텍스트 */}
                <span
                  className="flex-1 overflow-hidden"
                  style={{
                    color: i === 0 ? '#566276' : '#404959',
                    fontFamily: 'Pretendard Variable',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '140%',
                    letterSpacing: '-0.28px',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                    textOverflow: 'ellipsis',
                  }}
                >
                  {query}
                </span>

                {/* 개별 삭제 버튼 (16×16) */}
                <button
                  type="button"
                  onClick={() => onRemove?.(i)}
                  className="flex-shrink-0"
                  style={{ width: '16px', height: '16px' }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1l8 8M9 1L1 9"
                      stroke="#6B7A94"
                      strokeWidth="1"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* 빈 상태 텍스트 */
          <p
            className="self-stretch text-center mt-[60px]"
            style={{
              color: '#6B7A94',
              fontFamily: 'Pretendard Variable',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '140%',
              letterSpacing: '-0.32px',
            }}
          >
            최근 검색어가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
