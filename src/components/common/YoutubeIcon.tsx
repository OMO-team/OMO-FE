type YoutubeIconProps = {
  className?: string;
};

export default function YoutubeIcon({ className }: YoutubeIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="6.5" width="18" height="11" rx="3" fill="#FF0000" />
      <path d="M10.5 9.3L15 12L10.5 14.7V9.3Z" fill="white" />
    </svg>
  );
}
