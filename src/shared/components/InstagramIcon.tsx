type InstagramIconProps = {
  className?: string;
};

export default function InstagramIcon({ className }: InstagramIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="instagram-gradient" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFDD55" />
          <stop offset="0.5" stopColor="#FF543E" />
          <stop offset="1" stopColor="#C837AB" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" stroke="url(#instagram-gradient)" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="5" stroke="url(#instagram-gradient)" strokeWidth="1.8" />
      <circle cx="17.8" cy="6.2" r="1.2" fill="url(#instagram-gradient)" />
    </svg>
  );
}
