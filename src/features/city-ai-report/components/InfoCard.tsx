interface InfoCardProps {
  title: string;
  description: string;
}

export default function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="flex flex-col justify-start items-start w-[440px] gap-1 px-6 py-4 rounded-3 bg-gray-100">
      <div className="flex flex-col justify-start items-start self-stretch relative gap-2">
        <p className="body-01 text-[#181a1f] self-stretch">{title}</p>
        <p className="body-03 text-gray-600 self-stretch">{description}</p>
      </div>
    </div>
  );
}
