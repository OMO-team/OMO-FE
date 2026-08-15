interface DocumentCardProps {
  topic: string;
  title: string;
  url: string;
}

export default function DocumentCard({ topic, title, url }: DocumentCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col justify-start items-start overflow-hidden gap-1 px-[clamp(12px,2.211538cqw,23px)] py-3 rounded-3 bg-primary-50 hover:bg-primary-100"
    >
      {/* floor를 낮게 잡아, 부모(AISearchResult)의 실제 남은 폭이 박스 기준 %보다 더 좁게 줄어드는
          경우에도 넘치지 않고 flex-wrap이 먼저 개입할 여지를 준다 */}
      <div className="flex w-[clamp(160px,29.807692cqw,310px)] flex-col items-start justify-start relative gap-1">
        <p className="body-02 text-primary-700 self-stretch">{topic}</p>
        <p className="body-02 text-gray-700 self-stretch">{title}</p>
      </div>
    </a>
  );
}
