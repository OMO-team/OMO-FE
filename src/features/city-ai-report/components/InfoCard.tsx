import { forwardRef } from 'react';

interface InfoCardProps {
  title: string;
  description: string;
  height?: number;
}

const InfoCard = forwardRef<HTMLDivElement, InfoCardProps>(function InfoCard(
  { title, description, height },
  ref,
) {
  return (
    <div
      ref={ref}
      style={height ? { height } : undefined}
      className="flex w-[clamp(280px,42.307692cqw,440px)] flex-col items-start justify-start gap-1 rounded-3 bg-gray-100 px-6 py-4"
    >
      <div className="flex flex-col items-start justify-start gap-2 self-stretch">
        <p className="body-01 text-[#181a1f] self-stretch">{title}</p>
        <p className="body-03 text-gray-600 self-stretch">{description}</p>
      </div>
    </div>
  );
});

export default InfoCard;
