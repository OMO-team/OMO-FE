type MinusIconProps = {
  className?: string;
};

export default function MinusIcon({ className }: MinusIconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <line x1="4.65067" y1="10.3493" x2="15.3493" y2="10.3493" stroke="currentColor" strokeWidth="1.30133" strokeLinecap="round" />
    </svg>
  );
}
