type TopAlertBannerVariant = 'blue' | 'teal' | 'red';

type TopAlertBannerProps = {
  message: string;
  variant?: TopAlertBannerVariant;
  showRetry?: boolean;
  onRetry?: () => void;
  onClose?: () => void;
};

const VARIANT = {
  blue: {
    banner: 'border-[#C2E2FF] bg-[#E5F3FF]',
    iconBg: 'bg-[#C2E2FF]',
    textColor: '#006ACC',
    chipBg: 'bg-[#E5F3FF]',
    chipText: '#0085FF',
    xStroke: '#47A7FF',
  },
  teal: {
    banner: 'border-[#C4F2ED] bg-[#E6FAF7]',
    iconBg: 'bg-[#C4F2ED]',
    textColor: '#2AC0AE',
    chipBg: 'bg-[#E6FAF7]',
    chipText: '#2AC0AE',
    xStroke: '#79E2D5',
  },
  red: {
    banner: 'border-[#FFCDC9] bg-[#FFECEB]',
    iconBg: 'bg-[#FFCDC9]',
    textColor: '#CC1400',
    chipBg: 'bg-[#FFECEB]',
    chipText: '#EB1600',
    xStroke: '#FF6B5E',
  },
} as const;

function ShieldUserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="#0085FF" strokeWidth="1.5"/>
      <path d="M16 15C16 16.105 16 17 12 17C8 17 8 16.105 8 15C8 13.895 9.79 13 12 13C14.21 13 16 13.895 16 15Z" stroke="#0085FF" strokeWidth="1.5"/>
      <path d="M3 10.417C3 7.219 3 5.62 3.378 5.082C3.755 4.545 5.258 4.03 8.265 3.001L8.838 2.805C10.405 2.268 11.188 2 12 2C12.812 2 13.595 2.268 15.162 2.805L15.735 3.001C18.742 4.03 20.245 4.545 20.622 5.082C21 5.62 21 7.22 21 10.417V11.991C21 14.496 20.163 16.428 19 17.904M3.193 14C4.05 18.298 7.576 20.513 9.899 21.527C10.62 21.842 10.981 22 12 22C13.02 22 13.38 21.842 14.101 21.527C14.68 21.275 15.332 20.947 16 20.533" stroke="#0085FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ClockIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22Z" stroke={stroke} strokeWidth="1.5"/>
      <path d="M12.0078 10.508C11.61 10.508 11.2285 10.666 10.9472 10.9473C10.6658 11.2286 10.5078 11.6102 10.5078 12.008C10.5078 12.4058 10.6658 12.7874 10.9472 13.0687C11.2285 13.35 11.61 13.508 12.0078 13.508C12.4056 13.508 12.7872 13.35 13.0685 13.0687C13.3498 12.7874 13.5078 12.4058 13.5078 12.008C13.5078 11.6102 13.3498 11.2286 13.0685 10.9473C12.7872 10.666 12.4056 10.508 12.0078 10.508ZM12.0078 10.508V7M15.0148 15.02L13.0658 13.072" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.75 0.749999C5.22715 0.749999 0.750001 5.22715 0.750001 10.75C0.75 16.2728 5.22715 20.75 10.75 20.75C16.2728 20.75 20.75 16.2728 20.75 10.75C20.75 5.22715 16.2728 0.75 10.75 0.749999Z" stroke="#EB1600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.75 6.75L10.75 10.75M10.75 14.75L10.74 14.75" stroke="#EB1600" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloseIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.75 0.75L0.75 14.75M0.75 0.75L14.75 14.75" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BannerIcon({ variant }: { variant: TopAlertBannerVariant }) {
  if (variant === 'red') return <WarningIcon />;
  if (variant === 'teal') return <ClockIcon stroke="#2ED1BE" />;
  return <ShieldUserIcon />;
}

const TEXT_STYLE: React.CSSProperties = {
  fontFamily: 'Pretendard Variable',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '140%',
  letterSpacing: '-0.28px',
};

export default function TopAlertBanner({
  message,
  variant = 'blue',
  showRetry = false,
  onRetry,
  onClose,
}: TopAlertBannerProps) {
  const v = VARIANT[variant];

  return (
    <div
      className={`inline-flex flex-col justify-center items-center border ${v.banner}`}
      style={{
        height: '48px',
        padding: '6px 20px',
        borderRadius: '100px',
        boxShadow: '0 3px 8px 0 rgba(6, 49, 88, 0.16)',
      }}
    >
      {/* 내부 행 */}
      <div className="flex items-center gap-[30px] self-stretch">

        {/* 아이콘 + 텍스트 */}
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center p-[6px] rounded-full flex-shrink-0 ${v.iconBg}`}>
            <div className="w-6 h-6 flex items-center justify-center">
              <BannerIcon variant={variant} />
            </div>
          </div>
          <span style={{ ...TEXT_STYLE, color: v.textColor, width: '428px' }}>
            {message}
          </span>
        </div>

        {/* 다시시도 칩 + X 버튼 */}
        <div className="flex items-center gap-2">
          {showRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`flex justify-center items-center rounded-lg flex-shrink-0 ${v.chipBg}`}
              style={{ width: '76px', padding: '6px 12px' }}
            >
              <span style={{ ...TEXT_STYLE, color: v.chipText, fontSize: '13px', letterSpacing: '-0.39px' }}>
                다시 시도
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className={`flex items-center justify-center p-[6px] rounded-full flex-shrink-0 ${v.chipBg}`}
          >
            <CloseIcon stroke={v.xStroke} />
          </button>
        </div>
      </div>
    </div>
  );
}
