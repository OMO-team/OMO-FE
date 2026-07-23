type PlusStepperIconProps = {
  className?: string;
};

export default function PlusStepperIcon({ className }: PlusStepperIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="20" height="20" rx="4" fill="#E7EAEF" />
      <path
        d="M15 10L10 10M10 10L5 10M10 10L10 15M10 10L10 5"
        stroke="#FF2A14"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
