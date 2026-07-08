import type { ReactNode } from "react";

interface SettingsSectionHeaderProps {
  icon: ReactNode;
  title: string;
}

export default function SettingsSectionHeader({
  icon,
  title,
}: SettingsSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-300 p-[30px]">
      <span className="flex size-icon-md items-center justify-center">
        {icon}
      </span>
      <p className="title-01 text-gray-900">{title}</p>
    </div>
  );
}
