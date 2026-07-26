import type { ReactNode } from 'react';
import ChevronIcon from './ChevronIcon';

type NetworkErrorBannerVariant = 'error' | 'warning' | 'notice';

const VARIANT_CLASS: Record<NetworkErrorBannerVariant, { bg: string; border: string; action: string }> = {
  error: { bg: 'bg-red-50', border: 'border-red-100', action: 'text-red-500' },
  warning: { bg: 'bg-[#fff7ed]', border: 'border-[#fed7aa]', action: 'text-[#ea580c]' },
  notice: { bg: 'bg-[#fefce8]', border: 'border-[#fde68a]', action: 'text-[#ea580c]' },
};

type NetworkErrorBannerProps = {
  variant: NetworkErrorBannerVariant;
  icon: ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function NetworkErrorBanner({ variant, icon, message, actionLabel, onAction }: NetworkErrorBannerProps) {
  const { bg, border, action } = VARIANT_CLASS[variant];

  return (
    <div className={`flex w-full items-center gap-3 rounded-3.5 border ${border} ${bg} px-4.25 py-3.75`}>
      <span className="flex size-4 shrink-0 items-center justify-center text-gray-900">{icon}</span>
      <p className="body-02 flex-1 text-gray-900">{message}</p>
      {actionLabel && (
        <button type="button" onClick={onAction} className={`flex shrink-0 items-center gap-1 ${action}`}>
          <span className="text-[12px] font-semibold">{actionLabel}</span>
          <ChevronIcon className="size-3 rotate-180" />
        </button>
      )}
    </div>
  );
}
