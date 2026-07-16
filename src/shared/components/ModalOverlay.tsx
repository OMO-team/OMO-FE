import type { MouseEvent, ReactNode } from 'react';

type ModalOverlayProps = {
  children: ReactNode;
  onClose?: () => void;
  /** 모달 위에 또 다른 모달(예: 날짜 선택기)을 겹쳐 띄울 때 더 큰 값을 지정 */
  zIndex?: number;
};

export default function ModalOverlay({ children, onClose, zIndex = 50 }: ModalOverlayProps) {
  const stopPropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800/50 p-4"
      style={{ zIndex }}
      onClick={onClose}
    >
      <div onClick={stopPropagation}>{children}</div>
    </div>
  );
}
