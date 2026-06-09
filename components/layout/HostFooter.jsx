import Link from 'next/link';
import Image from 'next/image';

const COLS = [
  {
    heading: 'For Hosts',
    links: [
      { label: 'Host resources',    href: '#' },
      { label: 'Host insurance',    href: '#' },
      { label: 'Tax info',          href: '#' },
      { label: 'Pricing calculator',href: '#' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help center',    href: '#' },
      { label: 'Contact us',     href: '#' },
      { label: 'Trust & safety', href: '#' },
      { label: 'Report an issue',href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About BaliVilla', href: '#' },
      { label: 'Press',           href: '#' },
      { label: 'Careers',         href: '#' },
      { label: 'Guest site',      href: process.env.NEXT_PUBLIC_GUEST_URL ?? 'http://localhost:3000' },
    ],
  },
];

export function HostFooter() {
  return (
    <footer className="bg-surface-alt border-t border-rule mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/BaliVillalogo.png"
                alt="BaliVilla"
                width={120}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
            <p className="text-sm text-ink-mute leading-relaxed max-w-[200px]">
              Connecting Indonesian villa owners with Chinese travellers.
            </p>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-mute mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-soft hover:text-jade transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-rule flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-mute">
          <p>© 2026 BaliVilla. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-jade transition-colors">Terms</Link>
            <Link href="#" className="hover:text-jade transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-jade transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
