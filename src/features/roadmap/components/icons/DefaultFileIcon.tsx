type DefaultFileIconProps = {
  className?: string;
};

export default function DefaultFileIcon({ className }: DefaultFileIconProps) {
  return (
    <svg viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9 6C9 4.34315 10.3431 3 12 3H27L37 13V40C37 41.6569 35.6569 43 34 43H12C10.3431 43 9 41.6569 9 40V6Z" fill="#F4F5F7" />
      <path d="M27 3L37 13H29C27.8954 13 27 12.1046 27 11V3Z" fill="#CFD3DA" />
      <rect x="14" y="20" width="18" height="2.5" rx="1.25" fill="#B8BFCB" />
      <rect x="14" y="26" width="18" height="2.5" rx="1.25" fill="#B8BFCB" />
      <rect x="14" y="32" width="12" height="2.5" rx="1.25" fill="#B8BFCB" />
    </svg>
  );
}
