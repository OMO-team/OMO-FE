import type { ReactNode } from "react";

interface SettingActionItemProps {
  iconSrc?: string;
  iconBgClassName?: string;
  title: string;
  description?: string;
  right?: ReactNode;
  onClick?: () => void;
}

export default function SettingActionItem({
  iconSrc,
  iconBgClassName = "bg-primary-50",
  title,
  description,
  right,
  onClick,
}: SettingActionItemProps) {
  return (
    <div className="w-full px-[30px]">
      <div
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        className={`flex w-full items-center justify-between gap-4 rounded-3 px-5 py-1.5 ${
          onClick ? "cursor-pointer hover:bg-gray-50" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          {iconSrc && (
            <span
              className={`flex items-center justify-center rounded-2 p-3.5 ${iconBgClassName}`}
            >
              <img src={iconSrc} alt="" className="size-icon-md" />
            </span>
          )}
          <div className="flex flex-col items-start gap-1">
            <p className="title-02 text-gray-900">{title}</p>
            {description && (
              <p className="body-02 text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {right}
      </div>
    </div>
  );
}
