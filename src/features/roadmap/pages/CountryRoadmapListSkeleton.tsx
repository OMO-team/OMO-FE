function Bone({ className = '' }: { className?: string }) {
  return <div className={`rounded-2 bg-gray-100 ${className}`} />;
}

function CityCardSkeleton() {
  return (
    <div className="flex w-130.5 flex-col overflow-hidden rounded-4 border border-gray-100 bg-white">
      <Bone className="h-62.5 w-full rounded-none" />
      <div className="flex flex-col gap-5 px-9 pb-7.5 pt-5">
        <div className="flex flex-col gap-4">
          <Bone className="h-5 w-40" />
          <Bone className="h-8 w-full" />
        </div>
        <Bone className="h-13 w-full" />
      </div>
    </div>
  );
}

export default function CountryRoadmapListSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-content animate-pulse flex-col gap-8 py-10">
      <Bone className="h-10.5 w-64 rounded-4" />
      <div className="flex flex-col gap-3">
        <Bone className="h-13.5 w-full rounded-4" />
        <div className="flex flex-wrap gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <CityCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
