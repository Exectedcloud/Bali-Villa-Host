'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Home, Calendar, BookOpen, MessageSquare,
  BarChart3, Banknote, User, ChevronLeft, ChevronRight,
  LogOut, ExternalLink, Menu, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useHost } from '@/hooks/useHost';
import { useLocale } from '@/providers/LocaleProvider';

function isActive(pathname, href) {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname.startsWith(href);
}

function LanguageSwitcher({ collapsed }) {
  const { locale, setLocale } = useLocale();

  function handleLangToggle() {
    setLocale(locale === 'id' ? 'en' : 'id');
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={handleLangToggle}
        className="flex items-center justify-center w-full rounded-lg px-2 py-1.5 text-xs font-semibold hover:bg-surface-alt transition-colors"
        title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
      >
        <span className={locale === 'id' ? 'text-jade' : 'text-ink-mute'}>ID</span>
        <span className="opacity-40 mx-0.5">/</span>
        <span className={locale === 'en' ? 'text-jade' : 'text-ink-mute'}>EN</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLangToggle}
      className="flex items-center gap-px rounded-full border border-rule text-xs font-semibold px-3 py-1.5 hover:border-jade transition-colors"
      title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
    >
      <span className={locale === 'id' ? 'text-jade' : 'text-ink-mute'}>ID</span>
      <span className="opacity-40 mx-0.5">/</span>
      <span className={locale === 'en' ? 'text-jade' : 'text-ink-mute'}>EN</span>
    </button>
  );
}

export function HostSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { user, host, isPending } = useHost();
  const qc = useQueryClient();

  const displayName = host?.displayName ?? [user?.firstName, user?.lastName].filter(Boolean).join(' ') ?? '';
  const avatarUrl   = user?.avatarUrl ?? '';
  const hostingSince = host?.hostingSince ?? '';

  const signOutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout/', {}),
    onSettled: () => { qc.clear(); router.replace('/login'); },
  });

  const NAV_ITEMS = [
    { key: 'dashboard',    href: '/dashboard',              icon: LayoutDashboard },
    { key: 'listings',     href: '/dashboard/listings',     icon: Home },
    { key: 'calendar',     href: '/dashboard/calendar',     icon: Calendar },
    { key: 'reservations', href: '/dashboard/reservations', icon: BookOpen },
    { key: 'messages',     href: '/dashboard/messages',     icon: MessageSquare },
    { key: 'insights',     href: '/dashboard/insights',     icon: BarChart3 },
    { key: 'payouts',      href: '/dashboard/payouts',      icon: Banknote },
    { key: 'profile',      href: '/dashboard/profile',      icon: User },
  ];

  function NavLink({ item, onClick }) {
    const active = isActive(pathname, item.href);
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150',
          active ? 'bg-jade-soft text-jade' : 'text-ink-mute hover:bg-surface-alt hover:text-jade',
        )}
      >
        <Icon className="size-5 shrink-0" />
        <span>{t(item.key)}</span>
      </Link>
    );
  }

  return (
    <>
      {/* ── Mobile header + hamburger ──────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-rule h-14 flex items-center justify-between px-4 shrink-0">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <Image src="/BaliVillalogo.png" alt="BaliVilla" width={120} height={30} className="h-7 w-auto" priority />
          <span className="text-xs font-medium text-mist hidden sm:inline">{t('forHosts')}</span>
        </Link>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="size-11 flex items-center justify-center rounded-xl text-ink-mute hover:bg-surface-alt transition-colors"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* ── Mobile drawer ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-ink/50" onClick={() => setDrawerOpen(false)} />
            <motion.div
              className="absolute top-0 left-0 bottom-0 w-72 bg-surface flex flex-col shadow-xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-rule shrink-0">
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

              {/* Nav */}
              <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
                {NAV_ITEMS.map((item) => (
                  <NavLink key={item.href} item={item} onClick={() => setDrawerOpen(false)} />
                ))}
              </nav>

              {/* Host info + actions */}
              <div className="border-t border-rule px-4 py-4 shrink-0 space-y-3">
                {!isPending && (
                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="size-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="size-9 rounded-full bg-jade-soft flex items-center justify-center text-jade text-xs font-bold shrink-0">
                        {(displayName || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink truncate">{displayName || 'Host'}</p>
                      {hostingSince && <p className="text-[11px] text-ink-mute">{t('hostSince', { year: hostingSince })}</p>}
                    </div>
                  </div>
                )}
                <LanguageSwitcher collapsed={false} />
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-sm text-ink-soft hover:bg-surface-alt transition-colors"
                >
                  <ExternalLink className="size-4" />
                  {t('previewPublicSite')}
                </a>
                <button
                  type="button"
                  disabled={signOutMutation.isPending}
                  onClick={() => { setDrawerOpen(false); signOutMutation.mutate(); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 w-full rounded-xl text-sm text-danger hover:bg-surface-alt transition-colors disabled:opacity-50"
                >
                  <LogOut className="size-4" />
                  {signOutMutation.isPending ? t('signingOut') : t('logOut')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside
        className={cn(
          'hidden lg:flex flex-col sticky top-0 h-screen bg-surface border-r border-rule z-40 shrink-0 transition-all duration-200 overflow-hidden',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-rule px-4 shrink-0 gap-3">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2 flex-1 min-w-0">
              <Image src="/BaliVillalogo.png" alt="BaliVilla" width={140} height={32} className="h-8 w-auto" />
              <span className="text-xs font-medium text-mist whitespace-nowrap">{t('forHosts')}</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="size-8 rounded-lg bg-jade flex items-center justify-center shrink-0 mx-auto">
              <span className="text-white text-xs font-bold">BV</span>
            </Link>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="size-7 rounded-lg border border-rule flex items-center justify-center text-ink-mute hover:bg-surface-alt hover:text-ink transition-colors shrink-0"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <div className="flex justify-center py-2 border-b border-rule">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="size-7 rounded-lg border border-rule flex items-center justify-center text-ink-mute hover:bg-surface-alt hover:text-ink transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="space-y-0.5 mb-6">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? t(item.key) : undefined}
                  className={cn(
                    'flex items-center py-2.5 mx-2 rounded-xl text-sm font-medium transition-colors duration-150',
                    collapsed
                      ? cn('justify-center px-2', active ? 'bg-jade-soft text-jade' : 'text-ink-mute hover:bg-surface-alt hover:text-jade')
                      : cn('gap-3 px-3 border-l-4', active ? 'bg-jade-soft text-jade border-jade' : 'text-ink-mute hover:bg-surface-alt hover:text-jade border-transparent'),
                  )}
                >
                  <Icon className="size-5 shrink-0" />
                  {!collapsed && <span className="flex-1">{t(item.key)}</span>}
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Bottom user section */}
        <div className="border-t border-rule p-3 relative shrink-0 space-y-1">
          {/* Language switcher */}
          <LanguageSwitcher collapsed={collapsed} />

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-surface border border-rule rounded-xl shadow-lg overflow-hidden z-50">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ink-soft hover:bg-surface-alt transition-colors"
                >
                  <ExternalLink className="size-4" />
                  {t('previewPublicSite')}
                </a>
                <div className="border-t border-rule" />
                <button
                  type="button"
                  disabled={signOutMutation.isPending}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-danger hover:bg-surface-alt transition-colors disabled:opacity-50"
                  onClick={() => { setDropdownOpen(false); signOutMutation.mutate(); }}
                >
                  <LogOut className="size-4" />
                  {signOutMutation.isPending ? t('signingOut') : t('logOut')}
                </button>
              </div>
            </>
          )}
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className={cn('flex items-center gap-2.5 w-full rounded-xl hover:bg-surface-alt transition-colors p-2', collapsed && 'justify-center')}
          >
            {isPending ? (
              <>
                <div className="size-8 rounded-full skeleton-shimmer shrink-0" />
                {!collapsed && (
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="h-3 w-20 skeleton-shimmer rounded" />
                    <div className="h-2.5 w-24 skeleton-shimmer rounded" />
                  </div>
                )}
              </>
            ) : (
              <>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="size-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="size-8 rounded-full bg-jade-soft flex items-center justify-center text-jade text-xs font-bold shrink-0">
                    {(displayName || '?')[0].toUpperCase()}
                  </div>
                )}
                {!collapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-xs font-semibold text-ink truncate">{displayName || 'Host'}</p>
                    {hostingSince && <p className="text-[11px] text-ink-mute truncate">{t('hostSince', { year: hostingSince })}</p>}
                  </div>
                )}
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
