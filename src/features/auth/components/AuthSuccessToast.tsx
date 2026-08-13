import { useEffect } from 'react';

type AuthSuccessToastProps = {
  type: 'login' | 'signup';
  onClose: () => void;
};

const MESSAGES = {
  login: '로그인 되었습니다.',
  signup: '회원가입이 되었습니다.',
};

export default function AuthSuccessToast({ type, onClose }: AuthSuccessToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 top-6 z-[70] -translate-x-1/2"
    >
      <div className="flex h-12 items-center gap-[30px] rounded-full border border-primary-100 bg-primary-50 px-5 shadow-[0_3px_8px_0_rgba(6,49,88,0.16)]">
        {/* 아이콘 + 텍스트 */}
        <div className="flex items-center gap-4">
          <span className="flex items-center rounded-full bg-primary-100 p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z" stroke="#0085FF" strokeWidth="1.5"/>
              <path d="M16 15C16 16.105 16 17 12 17C8 17 8 16.105 8 15C8 13.895 9.79 13 12 13C14.21 13 16 13.895 16 15Z" stroke="#0085FF" strokeWidth="1.5"/>
              <path d="M3 10.417C3 7.219 3 5.62 3.378 5.082C3.755 4.545 5.258 4.03 8.265 3.001L8.838 2.805C10.405 2.268 11.188 2 12 2C12.812 2 13.595 2.268 15.162 2.805L15.735 3.001C18.742 4.03 20.245 4.545 20.622 5.082C21 5.62 21 7.22 21 10.417V11.991C21 14.496 20.163 16.428 19 17.904M3.193 14C4.05 18.298 7.576 20.513 9.899 21.527C10.62 21.842 10.981 22 12 22C13.02 22 13.38 21.842 14.101 21.527C14.68 21.275 15.332 20.947 16 20.533" stroke="#0085FF" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="title-03 w-[428px] text-primary-600">
            {MESSAGES[type]}
          </span>
        </div>

        {/* 칩 + 닫기 버튼 */}
        <div className="flex items-center gap-2">
          <div className="flex w-[76px] items-center justify-center">
            <div className="flex items-center justify-center rounded-2 bg-primary-50 px-3 py-1.5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex items-center rounded-full bg-primary-50 p-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14.75 0.75L0.75 14.75M0.75 0.75L14.75 14.75" stroke="#47A7FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
