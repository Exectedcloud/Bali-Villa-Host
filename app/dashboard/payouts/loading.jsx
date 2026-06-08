function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function PayoutsLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skel className="h-9 w-36" />
        <Skel className="h-4 w-56" />
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-xl border border-rule p-5 flex flex-col gap-3">
            <div className="flex justify-between">
              <Skel className="h-3 w-24" />
              <Skel className="size-8 rounded-lg" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Skel className="h-9 w-36" />
              <Skel className="h-3 w-20" />
            </div>
            <Skel className="h-3 w-28" />
            {i === 1 && <Skel className="h-9 w-full rounded-xl mt-1" />}
          </div>
        ))}
      </div>

      {/* Payout history table */}
      <div className="bg-surface rounded-xl border border-rule overflow-hidden">
        <div className="px-5 py-4 border-b border-rule flex flex-col gap-1.5">
          <Skel className="h-4 w-32" />
          <Skel className="h-3 w-40" />
        </div>
        <div className="divide-y divide-rule">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-5 px-5 py-3">
              <Skel className="h-4 w-24 shrink-0" />
              <Skel className="h-4 w-32 shrink-0" />
              <Skel className="h-4 flex-1" />
              <Skel className="h-6 w-20 rounded-full shrink-0" />
              <Skel className="h-4 w-28 shrink-0" />
              <Skel className="h-4 w-16 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Banking info */}
      <div className="bg-surface rounded-xl border border-rule p-5">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col gap-1.5">
            <Skel className="h-4 w-36" />
            <Skel className="h-3 w-28" />
          </div>
          <Skel className="h-8 w-36 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-surface-alt rounded-lg p-3 flex flex-col gap-1.5">
              <Skel className="h-2.5 w-20" />
              <Skel className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
