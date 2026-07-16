type TimelineSuccessIconProps = {
  className?: string;
};

export default function TimelineSuccessIcon({ className }: TimelineSuccessIconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M25 14C25 20.0753 20.0753 25 14 25C7.9247 25 3 20.0753 3 14C3 7.9247 7.9247 3 14 3C20.0753 3 25 7.9247 25 14Z"
        fill="#E7EAEF"
        stroke="#B8BFCB"
        strokeWidth="1.5"
      />
      <path d="M10 14.3L12.2 16.5L17.7 11" stroke="#B8BFCB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
