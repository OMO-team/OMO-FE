type MinusStepperIconProps = {
  className?: string;
};

export default function MinusStepperIcon({ className }: MinusStepperIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="20" height="20" rx="4" fill="#E7EAEF" />
      <line x1="15.3493" y1="9.65067" x2="4.65067" y2="9.65067" stroke="#0085FF" strokeWidth="1.30133" strokeLinecap="round" />
    </svg>
  );
}
