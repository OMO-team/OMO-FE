type CalendarErrorIconProps = {
  className?: string;
};

export default function CalendarErrorIcon({ className }: CalendarErrorIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="5.5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 9.5H20" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.5V6.5M16 3.5V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9.5 13L14.5 18M14.5 13L9.5 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
