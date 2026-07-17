type RefreshIconProps = {
  className?: string;
};

export default function RefreshIcon({ className }: RefreshIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C5.5 13.5 3.5 12 2.7 9.8M2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C10.5 2.5 12.5 4 13.3 6.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M13.3 3.5V6.2H10.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.7 12.5V9.8H5.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
