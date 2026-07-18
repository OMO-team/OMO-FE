import InfoCircleIcon from './icons/InfoCircleIcon';

type DateAlertPillProps = {
  message: string;
};

export default function DateAlertPill({ message }: DateAlertPillProps) {
  return (
    <div className="flex h-9.5 items-center gap-2 rounded-full bg-red-50 py-2 pl-5 pr-6 text-red-700">
      <InfoCircleIcon className="size-icon-sm shrink-0 rotate-180" />
      <p className="body-03 whitespace-nowrap">{message}</p>
    </div>
  );
}
