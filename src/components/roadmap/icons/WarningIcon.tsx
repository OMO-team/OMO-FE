type WarningIconProps = {
  className?: string;
};

export default function WarningIcon({ className }: WarningIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M7.99998 1.00007C4.13397 1.00007 0.999953 4.13409 0.999953 8.0001C0.999953 11.8661 4.13397 15.0001 7.99998 15.0001C11.866 15.0001 15 11.8661 15 8.0001C15 4.13409 11.866 1.00007 7.99998 1.00007Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99988 5.20015L7.99988 8.00016M7.99988 10.8002L7.99288 10.8002"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
