function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function ListingsLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skel className="h-9 w-48" />
          <Skel className="h-4 w-36" />
        </div>
        <Skel className="h-10 w-40 rounded-xl shrink-0" />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2">
        {[80, 64, 72, 60].map((w, i) => (
          <Skel key={i} className={`h-8 w-${w === 80 ? '[80px]' : w === 64 ? '[64px]' : w === 72 ? '[72px]' : '[60px]'} rounded-full`} style={{ width: w }} />
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-rule overflow-hidden">
            <Skel className="aspect-[4/3] rounded-none" />
            <div className="p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Skel className="h-5 w-40" />
                <Skel className="h-3 w-28" />
              </div>
              <div className="flex gap-4">
                <Skel className="h-3 w-20" />
                <Skel className="h-3 w-10" />
                <Skel className="h-3 w-16" />
              </div>
              <Skel className="h-px w-full rounded-none" />
              <div className="flex justify-between">
                <div className="flex gap-1">
                  {[1,2,3,4].map((j) => <Skel key={j} className="size-8 rounded-lg" />)}
                </div>
                <Skel className="size-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
