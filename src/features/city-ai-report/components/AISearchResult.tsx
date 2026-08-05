import DocumentCard from "./DocumentCard";
import type { AISearchResultData } from "../../../shared/types/cityReport";

interface AISearchResultProps {
  result: AISearchResultData;
}

export default function AISearchResult({ result }: AISearchResultProps) {
  return (
    <div className="flex flex-col justify-start items-start w-[804px] overflow-hidden gap-1 px-[39px] py-6 rounded-3 bg-[#ddefff]">
      <div className="flex flex-col justify-start items-start self-stretch relative gap-4">
        <p className="body-02 text-primary-800 self-stretch">{result.answer}</p>
        <div className="flex flex-col justify-start items-start self-stretch relative gap-2.5">
          <p className="text-base font-semibold text-left text-primary-700 self-stretch">
            관련문서
          </p>
          <div className="flex justify-start items-center self-stretch gap-3.5">
            {result.documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                category={doc.category}
                title={doc.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
