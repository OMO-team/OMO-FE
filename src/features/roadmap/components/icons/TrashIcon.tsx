type TrashIconProps = {
  className?: string;
};

export default function TrashIcon({ className }: TrashIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M4 7H20M9 7V5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 5V7M18 7L17.3 18.5C17.2 19.9 16 21 14.6 21H9.4C8 21 6.8 19.9 6.7 18.5L6 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11V16M14 11V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
