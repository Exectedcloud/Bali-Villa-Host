function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function CalendarLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-[1300px] animate-pulse">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Skel className="h-9 w-72" />
        <Skel className="h-4 w-56" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Skel className="h-9 w-40 rounded-lg" />
        <div className="flex items-center gap-1">
          <Skel className="size-9 rounded-lg" />
          <Skel className="h-6 w-36" />
          <Skel className="size-9 rounded-lg" />
        </div>
        <div className="ml-auto flex gap-3">
          {[1,2,3,4,5].map((i) => <Skel key={i} className="h-4 w-16" />)}
        </div>
      </div>

      {/* Calendar table */}
      <div className="rounded-xl border border-rule overflow-hidden">
        {/* Header row */}
        <div className="flex border-b border-rule bg-surface-alt/50">
          <Skel className="w-44 h-12 rounded-none shrink-0" />
          {Array.from({ length: 31 }).map((_, i) => (
            <Skel key={i} className="w-[38px] h-12 rounded-none shrink-0 border-l border-rule/40" />
          ))}
        </div>
        {/* Villa rows */}
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex border-b border-rule last:border-0">
            <div className="w-44 h-14 border-r border-rule shrink-0 p-3 flex items-center gap-2">
              <Skel className="size-8 rounded-md shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Skel className="h-3 w-24" />
                <Skel className="h-2.5 w-16" />
              </div>
            </div>
            {Array.from({ length: 31 }).map((_, i) => (
              <Skel key={i} className="w-[38px] h-14 rounded-none shrink-0 border-l border-rule/40" style={{ opacity: i % 7 === 0 || i % 7 === 6 ? 0.4 : 0.2 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
