import { useState } from "react";
import Chip from "../common/Chip";
import AISearchResult from "./AISearchResult";
import type { AISearchResultData } from "../../types/cityReport";

interface AISearchPanelProps {
  keywords: string[];
  onSearch: (query: string) => AISearchResultData;
}

export default function AISearchPanel({
  keywords,
  onSearch,
}: AISearchPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [result, setResult] = useState<AISearchResultData | null>(null);

  const runSearch = (query: string) => {
    if (!query.trim()) return;
    setSubmittedQuery(query);
    setResult(onSearch(query));
  };

  const handleKeywordClick = (keyword: string) => {
    setInputValue(keyword);
    runSearch(keyword);
  };

  return (
    <div
      className={`flex flex-col justify-start items-center self-stretch gap-3.5 pl-[42px] pr-9 pt-6 ${
        result ? "pb-7" : "pb-[30px]"
      } rounded-4 bg-primary-50`}
    >
      <div className="flex flex-col justify-center items-center self-stretch relative gap-3.5">
        <p className="title-01 text-primary-900 self-stretch">AI 맞춤 검색</p>
        <div className="flex flex-col justify-start items-start self-stretch gap-3">
          <div className="flex justify-start items-center gap-2">
            <div className="flex justify-start items-center w-[730px] overflow-hidden gap-1 px-[27px] py-3 rounded-3 bg-white border border-primary-100">
              {submittedQuery ? (
                <p className="text-base text-left text-gray-900 w-full truncate">
                  {submittedQuery}
                </p>
              ) : (
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch(inputValue)}
                  placeholder="궁금한 내용을 물어보세요"
                  className="text-base text-left text-gray-500 w-full outline-none bg-transparent placeholder:text-gray-500"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => runSearch(inputValue)}
              className="flex shrink-0 justify-center items-center h-[46px] overflow-hidden gap-1 px-[26px] py-2.5 rounded-3 bg-primary-500"
            >
              <p className="body-01 text-white ">검색</p>
            </button>
          </div>
          <div className="flex justify-start items-center gap-1.5">
            {keywords.map((keyword) => (
              <Chip
                key={keyword}
                label={keyword}
                onClick={() => handleKeywordClick(keyword)}
              />
            ))}
          </div>
        </div>
      </div>
      {result && <AISearchResult result={result} />}
    </div>
  );
}
