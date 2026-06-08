function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function OnboardingLoading() {
  return (
    <div className="min-h-screen bg-paper flex flex-col animate-pulse">
      {/* Top nav bar */}
      <div className="h-16 border-b border-rule bg-surface flex items-center justify-between px-8">
        <Skel className="h-6 w-24" />
        <Skel className="h-4 w-40" />
      </div>

      {/* Progress steps */}
      <div className="flex justify-center gap-2 py-6 border-b border-rule bg-surface">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skel className="size-8 rounded-full" />
            <Skel className="h-3 w-16" />
            {i < 4 && <Skel className="w-8 h-px ml-2" />}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-surface rounded-2xl border border-rule p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Skel className="h-8 w-56" />
            <Skel className="h-4 w-72" />
          </div>

          {/* Form fields */}
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skel className="h-3 w-28" />
              <Skel className="h-12 w-full rounded-xl" />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skel className="h-3 w-20" />
                <Skel className="h-12 w-full rounded-xl" />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <Skel className="h-3 w-20" />
            <Skel className="h-24 w-full rounded-xl" />
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between pt-2">
            <Skel className="h-11 w-24 rounded-xl" />
            <Skel className="h-11 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
