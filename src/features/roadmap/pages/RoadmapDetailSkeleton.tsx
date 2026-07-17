function Bone({ className = '' }: { className?: string }) {
  return <div className={`rounded-2 bg-gray-100 ${className}`} />;
}

function TaskCardSkeleton() {
  return (
    <div className="flex w-153.5 items-center gap-2 pl-2">
      <Bone className="size-icon-lg shrink-0 rounded-full" />
      <div className="flex w-144.5 flex-col gap-2 rounded-4 border border-gray-100 bg-white px-5 py-4">
        <Bone className="h-4 w-16" />
        <Bone className="h-3.5 w-32" />
      </div>
    </div>
  );
}

export default function RoadmapDetailSkeleton() {
  return (
    <div className="flex min-h-screen animate-pulse flex-col gap-8 bg-gray-20 py-10">
      <Bone className="h-147.5 w-full rounded-none" />

      <div className="mx-auto flex w-full max-w-content gap-7.5 px-4">
        <div className="flex flex-col gap-5">
          <div className="flex w-153.5 flex-col gap-4 rounded-4 border border-gray-100 bg-white px-6 pb-4 pt-7.5">
            <div className="flex items-center justify-between">
              <Bone className="h-5 w-24" />
              <Bone className="h-5 w-32" />
            </div>
            <div className="flex gap-4">
              <Bone className="h-6 w-40" />
              <Bone className="h-6 w-40" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-7.5">
          <div className="flex w-108.5 flex-col gap-10 rounded-4 border border-gray-100 bg-white px-7 pb-7.5 pt-6">
            <Bone className="h-6 w-28" />
            <Bone className="h-9 w-full" />
            <div className="flex flex-col gap-3">
              <Bone className="h-30 w-full" />
              <Bone className="h-13 w-full" />
            </div>
          </div>
          <div className="flex w-108.5 flex-col gap-4 rounded-4 border border-gray-100 bg-white p-7">
            <Bone className="h-6 w-28" />
            <Bone className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
