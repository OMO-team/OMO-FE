type CameraIconProps = {
  className?: string;
};

export default function CameraIcon({ className }: CameraIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M4 8.5C4 7.39543 4.89543 6.5 6 6.5H8L9.2 4.7C9.4 4.4 9.7 4 10.2 4H13.8C14.3 4 14.6 4.4 14.8 4.7L16 6.5H18C19.1046 6.5 20 7.39543 20 8.5V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
