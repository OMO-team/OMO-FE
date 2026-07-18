type ClockDelayIconProps = {
  className?: string;
};

export default function ClockDelayIcon({ className }: ClockDelayIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6.66667 1.33333H9.33333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 9.33333L10 7.33333" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8 14.6667C10.9455 14.6667 13.3333 12.2789 13.3333 9.33333C13.3333 6.38781 10.9455 4 8 4C5.05448 4 2.66667 6.38781 2.66667 9.33333C2.66667 12.2789 5.05448 14.6667 8 14.6667Z"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
