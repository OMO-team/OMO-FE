type CloudUploadIconProps = {
  className?: string;
};

export default function CloudUploadIcon({ className }: CloudUploadIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M7 18C4.79086 18 3 16.2091 3 14C3 12.0122 4.43385 10.3581 6.32213 10.0567C6.75173 7.71776 8.79417 6 11.2 6C13.6058 6 15.6483 7.71776 16.0779 10.0567C17.9662 10.3581 19.4 12.0122 19.4 14C19.4 16.2091 17.6091 18 15.4 18H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 16V10.5M11.2 10.5L9 12.7M11.2 10.5L13.4 12.7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
