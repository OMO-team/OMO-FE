type PlusScheduleIconProps = {
  className?: string;
};

export default function PlusScheduleIcon({ className }: PlusScheduleIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M5.25 12H18.75M12 5.25V18.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
