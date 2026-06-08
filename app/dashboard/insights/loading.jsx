function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function InsightsLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skel className="h-9 w-36" />
          <Skel className="h-4 w-48" />
        </div>
        <Skel className="h-9 w-36 rounded-lg shrink-0" />
      </div>

      {/* Chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-rule p-5 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Skel className="h-4 w-36" />
              <Skel className="h-3 w-48" />
            </div>
            <Skel className="h-[200px] w-full rounded-lg" />
          </div>
        ))}
        {/* Full-width row */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-rule p-5 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Skel className="h-4 w-40" />
            <Skel className="h-3 w-52" />
          </div>
          <Skel className="h-[180px] w-full rounded-lg" />
        </div>
      </div>

      {/* Top villas table */}
      <div className="bg-surface rounded-xl border border-rule overflow-hidden">
        <div className="px-5 py-4 border-b border-rule flex items-center gap-2">
          <Skel className="size-4 rounded" />
          <Skel className="h-4 w-40" />
        </div>
        <div className="divide-y divide-rule">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <Skel className="h-4 w-36 flex-1" />
              <Skel className="h-4 w-10" />
              <Skel className="h-4 w-20" />
              <Skel className="h-4 w-12" />
              <Skel className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
