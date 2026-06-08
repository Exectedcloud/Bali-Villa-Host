import Link from 'next/link';
import { LayoutDashboard, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center gap-8 p-6 text-center">
      {/* Large 404 */}
      <div className="relative select-none">
        <p className="font-display text-[10rem] font-medium leading-none text-jade/10">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-16 rounded-2xl bg-jade-soft flex items-center justify-center">
            <Home className="size-8 text-jade" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <h1 className="font-display text-3xl font-medium text-ink mb-2">Page not found</h1>
        <p className="text-sm text-ink-mute max-w-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Head back to your dashboard to continue managing your properties.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors"
        >
          <LayoutDashboard className="size-4" />
          Back to dashboard
        </Link>
        <Link
          href="/dashboard/listings"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:border-jade hover:text-jade transition-colors"
        >
          View listings
        </Link>
      </div>

      {/* Brand */}
      <p className="text-xs text-ink-mute mt-4">
        <span className="font-display text-sm text-ink">BaliVilla</span> for Hosts
      </p>
    </div>
  );
}
