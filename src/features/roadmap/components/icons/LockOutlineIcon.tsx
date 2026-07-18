type LockOutlineIconProps = {
  className?: string;
};

export default function LockOutlineIcon({ className }: LockOutlineIconProps) {
  return (
    <svg viewBox="0 0 27.125 27.125" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M21.474 12.4323H5.65104C4.40265 12.4323 3.39062 13.4444 3.39062 14.6927V22.6042C3.39062 23.8526 4.40265 24.8646 5.65104 24.8646H21.474C22.7224 24.8646 23.7344 23.8526 23.7344 22.6042V14.6927C23.7344 13.4444 22.7224 12.4323 21.474 12.4323Z"
        stroke="currentColor"
        strokeWidth="2.26042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.91148 12.4323V7.9115C7.91148 6.41275 8.50685 4.97538 9.56663 3.91561C10.6264 2.85583 12.0638 2.26046 13.5625 2.26046C15.0613 2.26046 16.4986 2.85583 17.5584 3.91561C18.6182 4.97538 19.2136 6.41275 19.2136 7.9115V12.4323"
        stroke="currentColor"
        strokeWidth="2.26042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
