function Skel({ className = '' }) {
  return <div className={`bg-rule/60 rounded-lg ${className}`} />;
}

export default function MessagesLoading() {
  return (
    <div
      className="flex bg-surface rounded-xl border border-rule overflow-hidden -m-4 lg:-m-8 animate-pulse"
      style={{ height: 'calc(100vh - 5.5rem)' }}
    >
      {/* Left: conversation list */}
      <div className="w-[30%] min-w-[220px] max-w-xs border-r border-rule flex flex-col shrink-0">
        <div className="px-4 py-3.5 border-b border-rule">
          <Skel className="h-5 w-24 mb-2.5" />
          <Skel className="h-8 w-full rounded-lg" />
        </div>
        <div className="flex-1 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 border-b border-rule flex gap-2.5">
              <Skel className="size-9 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex justify-between gap-2">
                  <Skel className="h-3.5 w-24 flex-1" />
                  <Skel className="h-3 w-12" />
                </div>
                <Skel className="h-3 w-28" />
                <Skel className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: chat area */}
      <div className="flex-1 flex flex-col">
        {/* Guest info bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-rule">
          <Skel className="size-9 rounded-full shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skel className="h-4 w-32" />
            <Skel className="h-3 w-28" />
          </div>
          <Skel className="h-8 w-28 rounded-lg" />
        </div>

        {/* Messages */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-4 overflow-hidden">
          {/* guest message */}
          <div className="flex gap-2.5">
            <Skel className="size-7 rounded-full shrink-0 mt-1" />
            <Skel className="h-16 w-64 rounded-2xl" />
          </div>
          {/* host message */}
          <div className="flex flex-row-reverse">
            <Skel className="h-12 w-56 rounded-2xl" />
          </div>
          <div className="flex gap-2.5">
            <Skel className="size-7 rounded-full shrink-0 mt-1" />
            <Skel className="h-20 w-72 rounded-2xl" />
          </div>
          <div className="flex flex-row-reverse">
            <Skel className="h-16 w-60 rounded-2xl" />
          </div>
          <div className="flex gap-2.5">
            <Skel className="size-7 rounded-full shrink-0 mt-1" />
            <Skel className="h-12 w-48 rounded-2xl" />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-rule px-4 pb-4 pt-3 flex flex-col gap-2">
          <Skel className="h-4 w-24" />
          <div className="flex items-end gap-2">
            <Skel className="size-9 rounded-lg shrink-0" />
            <Skel className="flex-1 h-16 rounded-xl" />
            <Skel className="size-9 rounded-lg shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
