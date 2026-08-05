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
      className="flex flex-col justify-start items-start overflow-hidden gap-1 px-[23px] py-3 rounded-3 bg-primary-50 hover:bg-primary-100"
    >
      <div className="flex flex-col justify-start items-start w-[310px] relative gap-1">
        <p className="body-02 text-primary-700 self-stretch">{topic}</p>
        <p className="body-02 text-gray-700 self-stretch">{title}</p>
      </div>
    </a>
  );
}
