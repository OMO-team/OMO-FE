type ServerErrorIconProps = {
  className?: string;
};

export default function ServerErrorIcon({ className }: ServerErrorIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="1.5" y="2" width="13" height="5" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1.5" y="9" width="13" height="5" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="4.3" cy="4.5" r="0.9" fill="currentColor" />
      <circle cx="4.3" cy="11.5" r="0.9" fill="currentColor" />
      <path d="M9 4.5H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9 11.5H12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
