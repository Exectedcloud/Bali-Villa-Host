import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function HostFooter() {
  const t = await getTranslations('footer');

  const COLS = [
    {
      heading: t('forHosts'),
      links: [
        { label: t('hostResources'),  href: '#' },
        { label: t('hostInsurance'),  href: '#' },
        { label: t('taxInfo'),        href: '#' },
        { label: t('pricingCalc'),    href: '#' },
      ],
    },
    {
      heading: t('support'),
      links: [
        { label: t('helpCenter'),   href: '#' },
        { label: t('contactUs'),    href: '#' },
        { label: t('trustSafety'), href: '#' },
        { label: t('reportIssue'), href: '#' },
      ],
    },
    {
      heading: t('company'),
      links: [
        { label: t('about'),     href: '#' },
        { label: t('press'),     href: '#' },
        { label: t('careers'),   href: '#' },
        { label: t('guestSite'), href: process.env.NEXT_PUBLIC_GUEST_URL ?? 'http://localhost:3000' },
      ],
    },
  ];

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
              {t('tagline')}
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
          <p>{t('rights')}</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-jade transition-colors">{t('terms')}</Link>
            <Link href="#" className="hover:text-jade transition-colors">{t('privacy')}</Link>
            <Link href="#" className="hover:text-jade transition-colors">{t('cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
