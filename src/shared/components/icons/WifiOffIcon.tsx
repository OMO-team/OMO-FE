type WifiOffIconProps = {
  className?: string;
};

export default function WifiOffIcon({ className }: WifiOffIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M1 1L15 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4.5 6.3C5.5 5.5 6.7 5 8 5C9 5 9.9 5.3 10.7 5.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M2 4C3.5 2.8 5.4 2 8 2C10.6 2 12.5 2.8 14 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M6.2 9.1C6.7 8.7 7.3 8.5 8 8.5C8.7 8.5 9.3 8.7 9.8 9.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="12.3" r="1" fill="currentColor" />
    </svg>
  );
}
