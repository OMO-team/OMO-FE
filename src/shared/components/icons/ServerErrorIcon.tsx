type ServerErrorIconProps = {
  className?: string;
};

export default function ServerErrorIcon({ className }: ServerErrorIconProps) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M4 6.66667H2.66667C2.31304 6.66667 1.97391 6.52619 1.72386 6.27614C1.47381 6.02609 1.33333 5.68696 1.33333 5.33333V2.66667C1.33333 2.31304 1.47381 1.97391 1.72386 1.72386C1.97391 1.47381 2.31304 1.33333 2.66667 1.33333H13.3333C13.687 1.33333 14.0261 1.47381 14.2761 1.72386C14.5262 1.97391 14.6667 2.31304 14.6667 2.66667V5.33333C14.6667 5.68696 14.5262 6.02609 14.2761 6.27614C14.0261 6.52619 13.687 6.66667 13.3333 6.66667H12"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 9.33333H2.66667C2.31304 9.33333 1.97391 9.47381 1.72386 9.72386C1.47381 9.97391 1.33333 10.313 1.33333 10.6667V13.3333C1.33333 13.687 1.47381 14.0261 1.72386 14.2761C1.97391 14.5262 2.31304 14.6667 2.66667 14.6667H13.3333C13.687 14.6667 14.0261 14.5262 14.2761 14.2761C14.5262 14.0261 14.6667 13.687 14.6667 13.3333V10.6667C14.6667 10.313 14.5262 9.97391 14.2761 9.72386C14.0261 9.47381 13.687 9.33333 13.3333 9.33333H12"
        stroke="currentColor"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 4H4.00667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 12H4.00667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.66667 4L6 8H10L7.33333 12" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
