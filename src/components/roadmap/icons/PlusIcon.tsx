type PlusIconProps = {
  className?: string;
};

export default function PlusIcon({ className }: PlusIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M5 10H10M10 10H15M10 10V5M10 10V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
