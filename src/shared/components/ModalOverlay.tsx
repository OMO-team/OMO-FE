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
      className="fixed inset-0 overflow-y-auto bg-gray-800/50"
      style={{ zIndex }}
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div onClick={stopPropagation}>{children}</div>
      </div>
    </div>
  );
}
