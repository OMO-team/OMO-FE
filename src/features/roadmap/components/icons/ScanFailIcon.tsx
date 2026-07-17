type ScanFailIconProps = {
  className?: string;
};

export default function ScanFailIcon({ className }: ScanFailIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 8V6C4 4.89543 4.89543 4 6 4H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 4H18C19.1046 4 20 4.89543 20 6V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 16V18C20 19.1046 19.1046 20 18 20H16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 20H6C4.89543 20 4 19.1046 4 18V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 10L15 15M15 10L9 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
