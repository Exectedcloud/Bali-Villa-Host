function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function ReservationsLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skel className="h-9 w-48" />
        <Skel className="h-4 w-52" />
      </div>

      {/* Tabs + search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1.5">
          {[72, 80, 80, 80, 88, 80].map((w, i) => (
            <Skel key={i} className="h-8 rounded-full" style={{ width: w }} />
          ))}
        </div>
        <Skel className="h-9 w-60 rounded-lg" />
      </div>

      {/* Count */}
      <Skel className="h-3 w-44 -mt-3" />

      {/* Table */}
      <div className="bg-surface rounded-xl border border-rule overflow-hidden">
        {/* Header */}
        <div className="flex border-b border-rule bg-surface-alt/50 px-4 py-3 gap-4">
          {[140, 160, 96, 96, 48, 100, 80, 48].map((w, i) => (
            <Skel key={i} className="h-3 rounded" style={{ width: w }} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-rule last:border-0">
            <div className="flex items-center gap-2.5" style={{ width: 140, flexShrink: 0 }}>
              <Skel className="size-8 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skel className="h-3.5 w-20" />
                <Skel className="h-2.5 w-24" />
              </div>
            </div>
            <Skel className="h-3.5 flex-1 max-w-[160px]" />
            <Skel className="h-3.5 w-24 shrink-0" />
            <Skel className="h-3.5 w-24 shrink-0" />
            <Skel className="h-3.5 w-10 shrink-0" />
            <div className="flex flex-col gap-1 items-end w-24 shrink-0">
              <Skel className="h-4 w-24" />
              <Skel className="h-3 w-16" />
            </div>
            <Skel className="h-5 w-20 rounded-full shrink-0" />
            <Skel className="h-7 w-14 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
