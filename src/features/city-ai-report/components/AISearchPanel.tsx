import { useState } from "react";
import Chip from "../../../shared/components/Chip";
import SearchInputBar from "../../../shared/components/SearchInputBar";
import AISearchResult from "./AISearchResult";
import type { AISearchResultData } from "../../../shared/types/cityReport";

interface AISearchPanelProps {
  keywords: string[];
  onSearch: (query: string) => Promise<AISearchResultData>;
}

export default function AISearchPanel({
  keywords,
  onSearch,
}: AISearchPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [result, setResult] = useState<AISearchResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const runSearch = async (query: string) => {
    if (!query.trim()) return;
    setSubmittedQuery(query);
    setResult(null);
    setHasError(false);
    setIsLoading(true);
    try {
      setResult(await onSearch(query));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setInputValue(keyword);
    runSearch(keyword);
  };

  return (
    <div
      className={`flex flex-col justify-start items-center self-stretch gap-3.5 pl-[42px] pr-9 pt-6 ${
        result || isLoading || hasError ? "pb-7" : "pb-[30px]"
      } rounded-4 bg-primary-50`}
    >
      <div className="flex flex-col justify-center items-center self-stretch relative gap-3.5">
        <p className="title-01 text-primary-900 self-stretch">AI 맞춤 검색</p>
        <div className="flex flex-col justify-start items-start self-stretch gap-3">
          <SearchInputBar
            value={inputValue}
            onChange={setInputValue}
            onSearch={runSearch}
            placeholder="궁금한 내용을 물어보세요"
            submittedQuery={submittedQuery}
          />
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
      {isLoading && (
        <p className="body-02 text-primary-700 self-stretch">답변을 불러오는 중...</p>
      )}
      {hasError && (
        <p className="body-02 text-red-500 self-stretch">답변을 가져오지 못했어요. 다시 시도해주세요.</p>
      )}
      {result && !isLoading && <AISearchResult result={result} />}
    </div>
  );
}
