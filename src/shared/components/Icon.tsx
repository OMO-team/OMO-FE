import type { ReactNode } from 'react';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASS: Record<IconSize, string> = {
  xs: 'size-icon-xs',
  sm: 'size-icon-sm',
  md: 'size-icon-md',
  lg: 'size-icon-lg',
  xl: 'size-icon-xl',
};

type IconProps = {
  size?: IconSize;
  className?: string;
  children: ReactNode;
};

// TODO: 실제 아이콘 SVG 세트가 프로젝트에 반영되면 children 슬롯 대신 name prop으로 아이콘을 매핑
export default function Icon({ size = 'md', className, children }: IconProps) {
  return (
    <span className={`inline-flex items-center justify-center ${SIZE_CLASS[size]}${className ? ` ${className}` : ''}`} aria-hidden>
      {children}
    </span>
  );
}
