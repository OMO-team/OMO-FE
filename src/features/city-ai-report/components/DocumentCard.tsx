interface DocumentCardProps {
  category: string;
  title: string;
}

export default function DocumentCard({ category, title }: DocumentCardProps) {
  return (
    <div className="flex flex-col justify-start items-start overflow-hidden gap-1 px-[23px] py-3 rounded-3 bg-primary-50">
      <div className="flex flex-col justify-start items-start w-[310px] relative gap-1">
        <p className="body-02 text-primary-700 self-stretch">{category}</p>
        <p className="body-02 text-gray-700 self-stretch">{title}</p>
      </div>
    </div>
  );
}
