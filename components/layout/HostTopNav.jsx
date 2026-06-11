'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import Avatar from '@/components/ui/Avatar';
import { useLocale } from '@/providers/LocaleProvider';

function useOptionalHost() {
  const { data, isPending } = useQuery({
    queryKey: ['host-me-public'],
    queryFn: async () => {
      try { return await api.get('/host/me/'); } catch { return null; }
    },
    retry: false,
    staleTime: 60_000,
  });
  return { user: data?.user ?? null, host: data?.host ?? null, isPending };
}

function displayName(user, host) {
  const name = host?.displayName
    ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ');
  return name || user?.email || '';
}

export function HostTopNav() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { locale, setLocale } = useLocale();
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth.login');
  const tNav = useTranslations('topnav');

  const { user, host, isPending } = useOptionalHost();
  const name = displayName(user, host);

  useEffect(() => { setDrawerOpen(false); }, [pathname]);
  useEffect(() => { setDropdownOpen(false); }, [pathname]);

  useEffect(() => {
    if (!dropdownOpen) return;
    function onDown(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [dropdownOpen]);

  function handleLangToggle() {
    setLocale(locale === 'id' ? 'en' : 'id');
  }

  async function handleLogout() {
    setDropdownOpen(false);
    setDrawerOpen(false);
    try { await api.post('/auth/logout/', {}); } catch { /* ignore */ }
    queryClient.setQueryData(['host-me-public'], null);
    queryClient.invalidateQueries({ queryKey: ['host-me'] });
  }

  const NAV_LINKS = [
    { label: tNav('howItWorks'), href: '/#how-it-works' },
    { label: tNav('commission'), href: '/#commission' },
    { label: tNav('faq'),        href: '/#faq' },
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

            {/* Language toggle pill — same style as balivilla-web */}
            <button
              type="button"
              onClick={handleLangToggle}
              className="hidden sm:flex items-center gap-px rounded-full border border-rule text-xs font-semibold px-3 py-1.5 hover:border-jade transition-colors"
              title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            >
              <span className={locale === 'id' ? 'text-jade' : 'text-ink-mute'}>ID</span>
              <span className="opacity-40 mx-0.5">/</span>
              <span className={locale === 'en' ? 'text-jade' : 'text-ink-mute'}>EN</span>
            </button>

            {/* Logged-in: avatar + dropdown */}
            {!isPending && user && (
              <div ref={dropdownRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-surface-alt transition-colors"
                  aria-label="Account menu"
                >
                  <Avatar src={user.avatarUrl} name={name} size={32} />
                  <ChevronDown className={cn('size-3.5 text-ink-mute transition-transform duration-200', dropdownOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97, y: -4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute top-full right-0 mt-2 w-56 bg-surface border border-rule rounded-xl shadow-lg overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-rule">
                        <p className="text-sm font-semibold text-ink truncate">{name || user.email}</p>
                        {name && <p className="text-xs text-mist truncate mt-0.5">{user.email}</p>}
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-soft hover:bg-surface-alt hover:text-ink transition-colors"
                        >
                          <LayoutDashboard className="size-4 text-ink-mute" />
                          {t('dashboard')}
                        </Link>
                      </div>
                      <div className="border-t border-rule py-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors"
                        >
                          <LogOut className="size-4" />
                          {t('logOut')}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Not logged-in: login + get started */}
            {!isPending && !user && (
              <>
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
                  {tNav('getStarted')}
                </Link>
              </>
            )}

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

              <div className="flex flex-col px-3 py-4">
                {!isPending && user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                      <Avatar src={user.avatarUrl} name={name} size={40} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{name || user.email}</p>
                        {name && <p className="text-xs text-mist truncate">{user.email}</p>}
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-ink-soft hover:bg-surface-alt transition-colors"
                    >
                      <LayoutDashboard className="size-4 text-ink-mute" />
                      {t('dashboard')}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 mt-1 rounded-xl text-sm text-danger hover:bg-danger/5 transition-colors"
                    >
                      <LogOut className="size-4" />
                      {t('logOut')}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-1 py-1">
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
                      {tNav('getStarted')}
                    </Link>
                  </div>
                )}
              </div>

              {/* Language toggle — bottom of drawer, same style as balivilla-web */}
              <div className="mt-auto px-5 pb-8">
                <button
                  type="button"
                  onClick={handleLangToggle}
                  className="text-sm font-semibold hover:text-jade transition-colors"
                >
                  <span className={locale === 'id' ? 'text-jade' : 'text-ink-mute'}>ID</span>
                  <span className="text-ink-mute mx-0.5">/</span>
                  <span className={locale === 'en' ? 'text-jade' : 'text-ink-mute'}>EN</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
