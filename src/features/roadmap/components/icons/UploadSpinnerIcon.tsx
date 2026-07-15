type UploadSpinnerIconProps = {
  className?: string;
};

export default function UploadSpinnerIcon({ className }: UploadSpinnerIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`animate-spin ${className ?? ''}`}>
      <path
        d="M14 8A6 6 0 1 1 8 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
