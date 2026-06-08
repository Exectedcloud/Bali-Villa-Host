'use client';

import { RefreshCw } from 'lucide-react';

export default function DashboardError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-5 text-center">
      <div className="size-14 rounded-2xl bg-jade-soft flex items-center justify-center">
        <RefreshCw className="size-7 text-jade" />
      </div>
      <div>
        <p className="text-lg font-semibold text-ink mb-1">Something went wrong</p>
        <p className="text-sm text-ink-mute max-w-sm">
          An unexpected error occurred on this page. Please try again — if the problem persists, contact support.
        </p>
        {process.env.NODE_ENV === 'development' && error?.message && (
          <p className="mt-3 text-xs font-mono text-danger/80 bg-danger/5 px-3 py-2 rounded-lg max-w-md mx-auto text-left break-all">
            {error.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={reset}
        className="px-6 py-2.5 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
