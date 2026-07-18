type CalendarErrorIconProps = {
  className?: string;
};

export default function CalendarErrorIcon({ className }: CalendarErrorIconProps) {
  return (
    <svg viewBox="0 0 27.125 27.125" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9.04165 2.26046V6.78129" stroke="currentColor" strokeWidth="2.26042" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.0834 2.26046V6.78129" stroke="currentColor" strokeWidth="2.26042" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M23.7344 14.6927V6.78121C23.7344 6.18171 23.4962 5.60676 23.0723 5.18285C22.6484 4.75894 22.0735 4.52079 21.474 4.52079H5.65104C5.05154 4.52079 4.4766 4.75894 4.05269 5.18285C3.62878 5.60676 3.39063 6.18171 3.39062 6.78121V22.6041C3.39063 23.2036 3.62878 23.7786 4.05269 24.2025C4.4766 24.6264 5.05154 24.8645 5.65104 24.8645H14.6927"
        stroke="currentColor"
        strokeWidth="2.26042"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3.39062 11.302H23.7344" stroke="currentColor" strokeWidth="2.26042" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.2135 24.8646L24.8646 19.2136" stroke="currentColor" strokeWidth="2.26042" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.2135 19.2136L24.8646 24.8646" stroke="currentColor" strokeWidth="2.26042" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
