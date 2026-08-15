import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../../assets/icons/icon-search[18].svg';
import closeIcon from '../../../assets/icons/icon-close[14].svg';
import trashIcon from '../../../assets/icons/icon-trash.svg';
import {
  parseSearchQuery,
  hasStructuredCondition,
} from '../../city-insight/utils/parseSearchQuery';

type SearchModalProps = {
  onClose: () => void;
  recentSearches?: string[];
  onSearch?: (query: string) => void;
  onRemove?: (index: number) => void;
  onClearAll?: () => void;
};

export default function SearchModal({
  onClose,
  recentSearches = [],
  onSearch,
  onRemove,
  onClearAll,
}: SearchModalProps) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const hasSearches = recentSearches.length > 0;

  const submitQuery = (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) return;
    onSearch?.(query);
    // "아시아"처럼 단어 하나만 쳐도 조건이 파싱되면 구조화 검색으로 보낸다 — 문장 모양이 아니라
    // 실제로 뽑힌 조건 유무로 판단해야 대륙명 단독 검색 같은 경우를 놓치지 않는다
    const parsed = parseSearchQuery(query);
    if (hasStructuredCondition(parsed)) {
      navigate('/city-insight', { state: { parsedSearch: { query, ...parsed } } });
    } else {
      navigate(`/city-insight?keyword=${encodeURIComponent(query)}`);
    }
    onClose();
  };

  const handleSearch = () => submitQuery(searchValue);

  return (
    <div
      className="flex h-[min(496px,88vh)] w-full flex-col items-center overflow-hidden bg-white"
      role="dialog"
      aria-modal="true"
    >
      {/* L_Search Header */}
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full max-w-[1064px] items-center justify-between px-5 pb-6 pt-9">
          <div className="flex min-w-0 flex-1 items-center gap-[clamp(16px,6vw,57px)]">
            <button
              type="button"
              onClick={handleSearch}
              className="flex size-6 shrink-0 items-center justify-center"
            >
              <img src={searchIcon} alt="검색" className="size-[18px]" />
            </button>
            <input
              type="text"
              className="body-02 min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-500"
              placeholder="도시나 키워드로 검색하기"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSearch()}
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
        <div className="h-px w-full bg-gray-100" />
      </div>

      {/* L_Search Content */}
      <div className="flex w-full max-w-[1064px] min-h-0 flex-1 flex-col items-center">
        <div className="flex items-center justify-between self-stretch px-5 pb-0 pt-[clamp(24px,8vw,40px)]">
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
          <div className="scrollbar-hide mt-4 flex w-full min-h-0 flex-1 flex-col items-start overflow-x-hidden overflow-y-auto pb-4">
            {recentSearches.map((query, i) => (
              <div key={i} className="flex w-full items-center gap-1 px-5 py-5">
                <button
                  type="button"
                  onClick={() => submitQuery(query)}
                  className={`body-02 line-clamp-1 min-w-0 flex-1 overflow-hidden text-ellipsis text-left cursor-pointer ${i === 0 ? 'text-gray-600' : 'text-gray-700'}`}
                >
                  {query}
                </button>
                <button
                  type="button"
                  onClick={() => onRemove?.(i)}
                  className="size-4 shrink-0 cursor-pointer"
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
          <p className="body-01 mt-[clamp(32px,10vw,60px)] self-stretch text-center text-gray-500">
            최근 검색어가 없습니다
          </p>
        )}
      </div>
    </div>
  );
}
