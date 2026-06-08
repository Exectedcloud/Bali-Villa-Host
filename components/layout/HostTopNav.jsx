import Link from 'next/link';
import Image from 'next/image';

export function HostTopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/97 backdrop-blur-sm border-b border-rule">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <Image
            src="/BaliVillalogo.png"
            alt="BaliVilla"
            width={200}
            height={40}
            className="h-8 sm:h-10 w-auto"
            priority
          />
          <span className="text-sm font-medium text-mist hidden sm:inline">for Hosts</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-ink-soft hover:text-ink px-3 py-2 rounded-lg hover:bg-surface-alt transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-jade text-white hover:bg-jade-deep transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
