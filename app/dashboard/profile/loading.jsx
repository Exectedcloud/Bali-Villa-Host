function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function ProfileLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl animate-pulse">
      {/* Header with avatar */}
      <div className="flex items-center gap-4">
        <Skel className="size-14 rounded-full shrink-0" />
        <div className="flex flex-col gap-2">
          <Skel className="h-8 w-44" />
          <Skel className="h-4 w-56" />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-rule pb-0">
        {[128, 156, 112, 80].map((w, i) => (
          <Skel key={i} className="h-10 rounded-t-lg rounded-b-none" style={{ width: w }} />
        ))}
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-6">
        {/* Avatar upload */}
        <div className="flex flex-col gap-2">
          <Skel className="h-3 w-24" />
          <div className="flex items-center gap-4">
            <Skel className="size-20 rounded-full shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skel className="h-4 w-32" />
              <Skel className="h-3 w-56" />
              <Skel className="h-4 w-20 mt-1" />
            </div>
          </div>
        </div>

        {/* Name + bio */}
        <div className="flex flex-col gap-2">
          <Skel className="h-3 w-28" />
          <Skel className="h-10 w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-2">
          <Skel className="h-3 w-8" />
          <Skel className="h-24 w-full rounded-xl" />
        </div>

        {/* Languages */}
        <div className="flex flex-col gap-2">
          <Skel className="h-3 w-32" />
          <div className="flex flex-wrap gap-2">
            {[80, 96, 120, 72, 80, 88, 72, 64, 80].map((w, i) => (
              <Skel key={i} className="h-7 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Skel className="h-3 w-20" />
            <Skel className="h-10 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <Skel className="h-3 w-24" />
            <Skel className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Skel className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
