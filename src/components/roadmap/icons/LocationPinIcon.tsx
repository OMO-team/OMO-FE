type LocationPinIconProps = {
  className?: string;
};

export default function LocationPinIcon({ className }: LocationPinIconProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M5 11.9111C5 6.85202 9.02975 2.75027 14 2.75027C18.9703 2.75027 23 6.85202 23 11.9111C23 16.9309 20.1279 22.7899 15.6459 24.8835C15.1307 25.1247 14.5688 25.2498 14 25.2498C13.4312 25.2498 12.8693 25.1247 12.3541 24.8835C7.87212 22.7888 5 16.932 5 11.9123V11.9111Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 15.1253C15.864 15.1253 17.375 13.6142 17.375 11.7503C17.375 9.88631 15.864 8.37527 14 8.37527C12.136 8.37527 10.625 9.88631 10.625 11.7503C10.625 13.6142 12.136 15.1253 14 15.1253Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
