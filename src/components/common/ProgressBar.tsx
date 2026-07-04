interface ProgressBarProps {
  percent: number;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  color?: "primary" | "gray" | "gradient";
}

export default function ProgressBar({
  label,
  leftLabel,
  rightLabel,
  percent,
  color = "gradient",
}: ProgressBarProps) {
  const fillClass =
    color === "gray"
      ? "bg-gray-400"
      : color === "primary"
        ? "bg-primary-500"
        : "bg-linear-to-l from-primary-500 to-primary-200";

  return (
    <div className="flex flex-col gap-1">
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between">
          {label && <p className="Body-04">{label}</p>}
          <span className="label-01 text-gray-500">{leftLabel}</span>
          <span className="label-01 text-gray-500">{rightLabel}</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-2 bg-gray-100">
        <div
          className={`h-full rounded-2 ${fillClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
