import DocumentCard from "./DocumentCard";
import type { AISearchResultData } from "../../../shared/types/cityReport";

interface AISearchResultProps {
  result: AISearchResultData;
}

export default function AISearchResult({ result }: AISearchResultProps) {
  // 박스 기준 %로 폭을 계산하면 패널 padding까지 이중으로 줄어드는 걸 못 따라가 좁은 화면에서 패널 밖으로
  // 넘쳤다. w-full로 실제 부모(패널 안쪽 여백을 뺀 콘텐츠 폭)에 맞추고 dev 원본 값(804px)은 상한으로만 유지한다
  return (
    <div className="flex w-full max-w-[804px] flex-col items-start justify-start overflow-hidden gap-1 px-[39px] py-6 rounded-3 bg-[#ddefff]">
      <div className="flex flex-col justify-start items-start self-stretch relative gap-4">
        <p className="body-02 text-primary-800 self-stretch">{result.summary}</p>
        {result.resources.length > 0 && (
          <div className="flex flex-col justify-start items-start self-stretch relative gap-2.5">
            <p className="text-base font-semibold text-left text-primary-700 self-stretch">
              관련문서
            </p>
            <div className="flex flex-wrap justify-start items-center self-stretch gap-3.5">
              {result.resources.map((resource) => (
                <DocumentCard
                  key={`${resource.topic}-${resource.title}`}
                  topic={resource.topic}
                  title={resource.title}
                  url={resource.url}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
