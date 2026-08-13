import type { MouseEvent, ReactNode } from 'react';

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

  return (
    <div
      className={`fixed inset-0 flex justify-center bg-gray-800/50 px-4 pb-4 ${align === 'top' ? 'items-start pt-0' : 'items-center pt-4'}`}
      style={{ zIndex }}
      onClick={onClose}
    >
      <div onClick={stopPropagation}>{children}</div>
    </div>
  );
}
