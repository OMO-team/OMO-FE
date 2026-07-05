type TimelineLockIconProps = {
  className?: string;
};

export default function TimelineLockIcon({ className }: TimelineLockIconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="2" width="24" height="24" rx="12" fill="#E7EAEF" />
      <path
        d="M9.125 21.4287H18.875C19.7687 21.4287 20.5 20.7601 20.5 19.943V13.2572C20.5 12.4401 19.7687 11.7715 18.875 11.7715H18.0625V10.2858C18.0625 8.23553 16.2425 6.57153 14 6.57153C11.7575 6.57153 9.9375 8.23553 9.9375 10.2858V11.7715H9.125C8.23125 11.7715 7.5 12.4401 7.5 13.2572V19.943C7.5 20.7601 8.23125 21.4287 9.125 21.4287ZM11.5625 10.2858C11.5625 9.0601 12.6594 8.05725 14 8.05725C15.3406 8.05725 16.4375 9.0601 16.4375 10.2858V11.7715H11.5625V10.2858Z"
        fill="#B8BFCB"
      />
    </svg>
  );
}
