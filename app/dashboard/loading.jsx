function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skel className="h-9 w-64" />
        <Skel className="h-4 w-40" />
      </div>

      {/* Alert strip */}
      <div className="flex gap-3">
        <Skel className="h-10 w-52 rounded-xl" />
        <Skel className="h-10 w-48 rounded-xl" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-xl border border-rule p-6 flex flex-col gap-4">
            <div className="flex justify-between">
              <Skel className="h-3 w-24" />
              <Skel className="size-8 rounded-lg" />
            </div>
            <Skel className="h-10 w-28" />
            <Skel className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="bg-surface rounded-xl border border-rule">
            <div className="px-5 py-4 border-b border-rule flex justify-between">
              <Skel className="h-4 w-32" />
              <Skel className="h-5 w-16 rounded-full" />
            </div>
            <div className="px-5 divide-y divide-rule">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <Skel className="size-9 rounded-full shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skel className="h-3.5 w-28" />
                    <Skel className="h-3 w-36" />
                  </div>
                  <Skel className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface rounded-xl border border-rule h-36" />
        </div>

        <div className="bg-surface rounded-xl border border-rule">
          <div className="px-5 py-4 border-b border-rule">
            <Skel className="h-4 w-24" />
          </div>
          <div className="divide-y divide-rule">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <Skel className="size-4 rounded shrink-0 mt-0.5" />
                <div className="flex-1">
                  <Skel className="h-3.5 w-full" />
                </div>
                <Skel className="h-7 w-16 rounded-lg shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
