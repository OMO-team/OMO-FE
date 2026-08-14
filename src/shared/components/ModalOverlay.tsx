import { useEffect, type MouseEvent, type ReactNode } from 'react';

type ModalOverlayProps = {
  children: ReactNode;
  onClose?: () => void;
  /** 모달 위에 또 다른 모달(예: 날짜 선택기)을 겹쳐 띄울 때 더 큰 값을 지정 */
  zIndex?: number;
  /** 화면 중앙(기본)이 아니라 위쪽에 붙여야 하는 모달(예: 헤더 검색창)에 사용 */
  align?: 'center' | 'top';
};

export default function ModalOverlay({
  children,
  onClose,
  zIndex = 50,
  align = 'center',
}: ModalOverlayProps) {
  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  // 모달 내용이 뷰포트보다 길면 배경(body)까지 같이 스크롤되던 문제 — 모달이 떠 있는 동안은
  // 배경 스크롤을 막아, 모달 자체의 overflow-y-auto로만 스크롤되게 한다
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 flex justify-center bg-gray-800/50 ${
        align === 'top' ? 'items-start' : 'items-center px-4 pb-4 pt-4'
      }`}
      style={{ zIndex }}
      onClick={onClose}
    >
      {align === 'top' ? (
        <div onClick={stopPropagation} className="w-full">
          {children}
        </div>
      ) : (
        <div className="flex min-h-full w-full items-center justify-center p-4">
          <div onClick={stopPropagation} className="flex w-full justify-center">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
