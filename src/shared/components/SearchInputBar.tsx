interface SearchInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  submittedQuery?: string | null;
  width? : string
}

export default function SearchInputBar({
  value,
  onChange,
  onSearch,
  placeholder = "검색어를 입력하세요",
  submittedQuery,
  width = 'w-[730px]'
}: SearchInputBarProps) {
  return (
    <div className='flex justify-start items-center gap-2'>
      <div className={`flex justify-start items-center ${width} overflow-hidden gap-1 px-[27px] py-3 rounded-3 bg-white border border-primary-100`}>
        {submittedQuery ? (
          <p className="text-base text-left text-gray-900 w-full truncate">
            {submittedQuery}
          </p>
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(value)}
            placeholder={placeholder}
            className="text-base text-left text-gray-500 w-full outline-none bg-transparent placeholder:text-gray-500"
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => onSearch(value)}
        className="flex shrink-0 justify-center items-center h-[46px] overflow-hidden gap-1 px-[26px] py-2.5 rounded-3 bg-primary-500"
      >
        <p className="body-01 text-white">검색</p>
      </button>
    </div>
  );
}
