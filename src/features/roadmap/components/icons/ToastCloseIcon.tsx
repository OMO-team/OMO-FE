type ToastCloseIconProps = {
  className?: string;
};

export default function ToastCloseIcon({ className }: ToastCloseIconProps) {
  return (
    <svg viewBox="0 0 9.47222 9.47222" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M9.01389 0.458333L0.458333 9.01389M0.458333 0.458333L9.01389 9.01389"
        stroke="currentColor"
        strokeWidth="0.916667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
