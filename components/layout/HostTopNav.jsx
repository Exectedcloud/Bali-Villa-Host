'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useLocale } from '@/providers/LocaleProvider';

const LOCALE_LABELS = { id: 'ID', en: 'EN', zh: '中' };

function LangPill() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const OPTIONS = [
    { code: 'id', label: 'Bahasa Indonesia' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="hidden sm:flex items-center gap-1.5 rounded-full border border-rule text-xs font-semibold px-3 py-1.5 text-ink-mute hover:border-jade hover:text-jade transition-colors"
      >
        <Globe className="size-3.5" />
        {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 w-44 bg-surface border border-rule rounded-xl shadow-lg overflow-hidden z-50"
          >
            {OPTIONS.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => { setLocale(code); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors border-b border-rule last:border-0 ${
                  locale === code
                    ? 'bg-jade-soft text-jade'
                    : 'text-ink-soft hover:bg-surface-alt hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HostTopNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth.login');

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  const NAV_LINKS = [
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Commission',   href: '/#commission' },
    { label: 'FAQ',          href: '/#faq' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-paper border-b border-rule shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/BaliVillalogo.png"
              alt="BaliVilla"
              width={200}
              height={40}
              className="h-8 sm:h-9 w-auto"
              priority
            />
            <span className="text-xs font-medium text-mist hidden sm:inline">{t('forHosts')}</span>
          </Link>

          {/* Center nav — desktop */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-ink-soft hover:text-jade transition-colors whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 shrink-0">
            <LangPill />
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium px-3 py-2 rounded-lg text-ink-soft hover:bg-surface-alt hover:text-ink transition-colors"
            >
              {tAuth('submit')}
            </Link>
            <Link
              href="/signup"
              className="hidden sm:block text-sm font-semibold px-4 py-2 rounded-lg bg-jade text-white hover:bg-jade-deep transition-colors"
            >
              Get started
            </Link>

            {/* Hamburger — mobile */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="sm:hidden flex items-center justify-center size-11 rounded-xl text-ink-soft hover:bg-surface-alt transition-colors"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[60] sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawerOpen(false)} />
            <motion.div
              className="absolute top-0 right-0 bottom-0 w-full max-w-xs bg-surface flex flex-col shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-5 h-14 border-b border-rule shrink-0">
                <Link href="/" onClick={() => setDrawerOpen(false)}>
                  <Image src="/BaliVillalogo.png" alt="BaliVilla" width={120} height={30} className="h-7 w-auto" />
                </Link>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="size-10 flex items-center justify-center rounded-xl text-ink-mute hover:bg-surface-alt transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex flex-col px-3 py-4 gap-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center px-4 py-3.5 rounded-xl text-sm font-medium text-ink hover:bg-surface-alt transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="border-t border-rule mx-4" />

              <div className="flex flex-col gap-2 px-4 py-4">
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-3.5 rounded-xl border border-rule text-sm font-semibold text-ink text-center hover:bg-surface-alt transition-colors"
                >
                  {tAuth('submit')}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-jade text-white text-sm font-semibold text-center hover:bg-jade-deep transition-colors"
                >
                  Get started
                </Link>
              </div>

              <div className="mt-auto px-5 pb-8 flex items-center gap-2">
                <Globe className="size-4 text-ink-mute" />
                {[{ code: 'id', label: 'ID' }, { code: 'en', label: 'EN' }, { code: 'zh', label: '中' }].map(({ code, label }, i, arr) => (
                  <LangButtonMobile key={code} code={code} label={label} last={i === arr.length - 1} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function LangButtonMobile({ code, label, last }) {
  const { locale, setLocale } = useLocale();
  return (
    <>
      <button
        type="button"
        onClick={() => setLocale(code)}
        className={`text-sm font-medium transition-colors ${locale === code ? 'text-jade font-semibold' : 'text-ink-mute hover:text-jade'}`}
      >
        {label}
      </button>
      {!last && <span className="text-ink-mute/40 text-xs">·</span>}
    </>
  );
}
