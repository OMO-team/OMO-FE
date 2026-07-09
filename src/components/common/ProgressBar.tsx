interface ProgressBarProps {
  percent: number;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  color?: "gray" | "gradient";
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
      : "bg-linear-to-l from-primary-500 to-primary-200";

  return (
    <div className="flex flex-col self-stretch gap-1">
      {label && <p className="body-04">{label}</p>}
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between">
          <span className="label-01 text-gray-500">{leftLabel}</span>
          <span className="label-01 text-gray-500">{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
