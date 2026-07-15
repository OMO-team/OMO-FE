interface SettingsSectionHeaderProps {
  iconSrc: string;
  title: string;
}

export default function SettingsSectionHeader({
  iconSrc,
  title,
}: SettingsSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-300 p-[30px]">
      <img src={iconSrc} alt="" className="size-icon-md" />
      <p className="title-01 text-gray-900">{title}</p>
    </div>
  );
}
