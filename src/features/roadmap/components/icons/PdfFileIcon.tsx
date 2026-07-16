type PdfFileIconProps = {
  className?: string;
};

export default function PdfFileIcon({ className }: PdfFileIconProps) {
  return (
    <svg viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9 6C9 4.34315 10.3431 3 12 3H27L37 13V40C37 41.6569 35.6569 43 34 43H12C10.3431 43 9 41.6569 9 40V6Z" fill="#F4F5F7" />
      <path d="M27 3L37 13H29C27.8954 13 27 12.1046 27 11V3Z" fill="#CFD3DA" />
      <rect x="6" y="20" width="26" height="14" rx="3" fill="#EF4444" />
      <path
        d="M11.5 30V23.5H14.1C15.4 23.5 16.2 24.3 16.2 25.6C16.2 26.9 15.4 27.7 14.1 27.7H12.9V30H11.5ZM12.9 26.5H13.9C14.5 26.5 14.8 26.2 14.8 25.6C14.8 25 14.5 24.7 13.9 24.7H12.9V26.5Z"
        fill="white"
      />
      <path
        d="M17 30V23.5H19.3C21.3 23.5 22.5 24.7 22.5 26.75C22.5 28.8 21.3 30 19.3 30H17ZM18.4 28.8H19.2C20.3 28.8 21 28.1 21 26.75C21 25.4 20.3 24.7 19.2 24.7H18.4V28.8Z"
        fill="white"
      />
      <path d="M23.5 30V23.5H27.5V24.7H24.9V26.2H27.2V27.4H24.9V30H23.5Z" fill="white" />
    </svg>
  );
}
