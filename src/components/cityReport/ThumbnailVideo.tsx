interface ThumbnailVideoProps {
  tag: string;
  title: string;
  thumbnailUrl?: string;
}

export default function ThumbnailVideo({
  tag,
  title,
  thumbnailUrl,
}: ThumbnailVideoProps) {
  return (
    <div
      className="w-[218px] h-[137px] relative overflow-hidden rounded-4 bg-cover bg-center"
      style={
        thumbnailUrl
          ? { backgroundImage: `url(${thumbnailUrl})` }
          : {
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-primary-900) 0%, transparent) 0%, color-mix(in srgb, var(--color-gray-900) 40%, transparent) 100%), var(--color-gray-50)",
            }
      }
    >
      <div className="flex flex-col justify-start items-start w-[184px] absolute left-[17px] top-[78px] gap-1">
        <div className="flex justify-center items-center gap-1 px-2 py-1 rounded-md bg-white/40">
          <p className="label-03 text-gray-700">{tag}</p>
        </div>
        <p className="body-04 text-white w-[184px]">{title}</p>
      </div>
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-[94px] top-[54px]"
      >
        <rect width="30" height="30" rx="15" fill="white" />
        <path d="M22 15L11.5 21.0622L11.5 8.93782L22 15Z" fill="#B8BFCB" />
      </svg>
    </div>
  );
}
