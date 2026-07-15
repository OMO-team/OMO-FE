type UploadIconProps = {
  className?: string;
};

export default function UploadIcon({ className }: UploadIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 15V4M12 4L8 8M12 4L16 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 15V17.5C4 18.8807 5.11929 20 6.5 20H17.5C18.8807 20 20 18.8807 20 17.5V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
