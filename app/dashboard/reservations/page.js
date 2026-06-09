'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api-client';
import Avatar from '@/components/ui/Avatar';

const PAGE_SIZE = 10;

export default function ReservationsPage() {
  const t  = useTranslations('reservations');
  const qc = useQueryClient();
  const [tab, setTab]       = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage]     = useState(1);

  const STATUS_META = {
    confirmed:        { label: t('status.confirmed'),       cls: 'bg-jade/10 text-jade' },
    in_house:         { label: t('status.inHouse'),         cls: 'bg-success/10 text-success' },
    completed:        { label: t('status.completed'),       cls: 'bg-mist/20 text-mist-deep' },
    pending_approval: { label: t('status.pendingApproval'), cls: 'bg-warn/10 text-warn' },
    cancelled:        { label: t('status.cancelled'),       cls: 'bg-danger/10 text-danger' },
  };

  const TABS = [
    { key: 'all',              label: t('tabs.all') },
    { key: 'pending_approval', label: t('tabs.pending') },
    { key: 'confirmed',        label: t('tabs.upcoming') },
    { key: 'in_house',         label: t('tabs.inHouse') },
    { key: 'completed',        label: t('tabs.completed') },
    { key: 'cancelled',        label: t('tabs.cancelled') },
  ];

  const { data, isPending } = useQuery({
    queryKey: ['host-bookings'],
    queryFn: () => api.get('/host/bookings/'),
  });
  const allBookings = data?.bookings ?? [];

  const approveMutation = useMutation({
    mutationFn: (id) => api.post(`/host/bookings/${id}/approve/`, {}),
    onSuccess: () => { toast.success(t('approvedToast')); qc.invalidateQueries({ queryKey: ['host-bookings'] }); },
    onError: () => toast.error(t('errorApprove')),
  });
  const declineMutation = useMutation({
    mutationFn: (id) => api.post(`/host/bookings/${id}/decline/`, {}),
    onSuccess: () => { toast.success(t('declinedToast')); qc.invalidateQueries({ queryKey: ['host-bookings'] }); },
    onError: () => toast.error(t('errorDecline')),
  });

  const filtered = useMemo(() => {
    let list = allBookings;
    if (tab !== 'all') list = list.filter((b) => b.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          (b.guestName ?? '').toLowerCase().includes(q) ||
          (b.villa?.titleEn ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allBookings, tab, search]);

  const total     = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const shown     = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabCounts = useMemo(
    () =>
      Object.fromEntries(
        TABS.map(({ key }) => [
          key,
          key === 'all'
            ? allBookings.length
            : allBookings.filter((b) => b.status === key).length,
        ])
      ),
    [allBookings]
  );

  function changeTab(key) { setTab(key); setPage(1); }
  function changeSearch(val) { setSearch(val); setPage(1); }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-6xl">

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink">{t('title')}</h1>
        <p className="text-sm text-ink-mute mt-1">{t('subtitle', { count: allBookings.length })}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="flex gap-1.5 overflow-x-auto pb-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => changeTab(key)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors min-h-[36px] ${
                tab === key
                  ? 'bg-jade text-white border-jade'
                  : 'bg-surface text-ink-soft border-rule hover:border-jade/40 hover:text-ink'
              }`}
            >
              {label}
              <span className={`ml-1.5 text-xs ${tab === key ? 'text-white/70' : 'text-ink-mute'}`}>
                {tabCounts[key]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-ink-mute pointer-events-none" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => changeSearch(e.target.value)}
            className="h-9 pl-9 pr-4 text-sm border border-rule rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-jade w-60 placeholder:text-ink-mute/60"
          />
        </div>
      </div>

      {/* Count summary */}
      <p className="text-xs text-ink-mute -mt-3">
        {t('showing', { shown: shown.length, total })}
      </p>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {isPending && (
          <div className="space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-28 skeleton-shimmer rounded-xl" />)}
          </div>
        )}
        {!isPending && shown.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="py-16 text-center"
          >
            <p className="text-sm font-medium text-ink mb-0.5">{t('empty.title')}</p>
            <p className="text-xs text-ink-mute">{t('empty.desc')}</p>
          </motion.div>
        )}
        {shown.map((bk) => {
          const { label, cls } = STATUS_META[bk.status] ?? { label: bk.status, cls: 'bg-mist/10 text-mist' };
          const needsApproval = bk.status === 'pending_approval';
          return (
            <div key={bk.id} className="bg-surface rounded-xl border border-rule shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar src={bk.guestAvatarUrl} name={bk.guestName} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{bk.guestName}</p>
                  <p className="text-xs text-ink-mute font-mono mt-0.5">{bk.reference}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cls}`}>{label}</span>
              </div>
              <p className="text-xs text-ink-soft truncate">{bk.villa?.titleEn ?? '—'}</p>
              <div className="flex items-center justify-between text-xs text-ink-mute">
                <span>{bk.checkIn} → {bk.checkOut} · {bk.nights}n</span>
                <span className="font-mono font-semibold text-jade">Rp {(bk.payoutIdr ?? 0).toLocaleString('id-ID')}</span>
              </div>
              {needsApproval ? (
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => approveMutation.mutate(bk.id)} disabled={approveMutation.isPending} className="flex-1 py-2.5 rounded-lg bg-jade text-white text-xs font-semibold hover:bg-jade-deep disabled:opacity-50 transition-colors min-h-[44px]">{t('approve')}</button>
                  <button type="button" onClick={() => declineMutation.mutate(bk.id)} disabled={declineMutation.isPending} className="flex-1 py-2.5 rounded-lg border border-rule text-danger text-xs font-semibold hover:border-danger disabled:opacity-50 transition-colors min-h-[44px]">{t('decline')}</button>
                </div>
              ) : (
                <Link href={`/dashboard/reservations/${bk.id}`} className="w-full py-2.5 rounded-lg border border-rule text-xs font-semibold text-ink-soft hover:border-jade hover:text-jade transition-colors text-center min-h-[44px] flex items-center justify-center">
                  {t('viewDetails')}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-surface rounded-xl border border-rule shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-rule bg-surface-alt/50">
                {[
                  { key: 'guest',    label: t('table.guest') },
                  { key: 'villa',    label: t('table.villa') },
                  { key: 'checkIn',  label: t('table.checkIn') },
                  { key: 'checkOut', label: t('table.checkOut') },
                  { key: 'nights',   label: t('table.nights') },
                  { key: 'payout',   label: t('table.payout') },
                  { key: 'status',   label: t('table.status') },
                  { key: 'actions',  label: '' },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-mute whitespace-nowrap ${
                      key === 'nights'  ? 'text-center' :
                      key === 'payout'  ? 'text-right'  :
                      key === 'actions' ? ''            :
                      'text-left'
                    }`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="px-4 py-2">
                      <div className="h-10 skeleton-shimmer rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : shown.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="py-20 text-center"
                    >
                      <CalendarDays className="size-8 text-ink-mute/30 mx-auto mb-2" />
                      <p className="text-sm font-medium text-ink mb-0.5">{t('empty.title')}</p>
                      <p className="text-xs text-ink-mute">{t('empty.desc')}</p>
                    </motion.div>
                  </td>
                </tr>
              ) : shown.map((bk) => {
                const { label, cls } = STATUS_META[bk.status] ?? { label: bk.status, cls: 'bg-mist/10 text-mist' };
                const needsApproval = bk.status === 'pending_approval';
                return (
                  <tr key={bk.id} className="border-b border-rule last:border-0 hover:bg-jade-soft/30 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={bk.guestAvatarUrl} name={bk.guestName} size={32} />
                        <div className="min-w-0">
                          <p className="font-semibold text-ink text-sm leading-tight">{bk.guestName}</p>
                          <p className="text-[11px] text-ink-mute font-mono mt-0.5">{bk.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-soft max-w-[170px]">
                      <p className="truncate">{bk.villa?.titleEn ?? '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">{bk.checkIn}</td>
                    <td className="px-4 py-3 text-sm text-ink whitespace-nowrap">{bk.checkOut}</td>
                    <td className="px-4 py-3 text-sm text-ink text-center">{bk.nights}</td>
                    <td className="px-4 py-3 text-right">
                      <p className="font-mono text-sm font-semibold text-ink">
                        Rp {(bk.payoutIdr ?? 0).toLocaleString('id-ID')}
                      </p>
                      <p className="font-mono text-[11px] text-mist mt-0.5">≈ ¥{(bk.totalCny ?? 0).toLocaleString()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${cls}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {needsApproval ? (
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => approveMutation.mutate(bk.id)}
                            disabled={approveMutation.isPending}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-jade text-white hover:bg-jade-deep disabled:opacity-50 transition-colors"
                          >
                            {t('approve')}
                          </button>
                          <button
                            type="button"
                            onClick={() => declineMutation.mutate(bk.id)}
                            disabled={declineMutation.isPending}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-rule text-danger hover:border-danger disabled:opacity-50 transition-colors"
                          >
                            {t('decline')}
                          </button>
                        </div>
                      ) : (
                        <Link
                          href={`/dashboard/reservations/${bk.id}`}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rule text-ink-soft hover:border-jade hover:text-jade transition-colors whitespace-nowrap"
                        >
                          {t('view')}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-rule bg-surface-alt/30">
            <p className="text-xs text-ink-mute">{t('pagination.page', { page, total: pageCount })}</p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="size-8 flex items-center justify-center rounded-lg border border-rule text-ink-mute hover:bg-jade-soft hover:border-jade/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`size-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                    p === page
                      ? 'bg-jade text-white'
                      : 'border border-rule text-ink-soft hover:bg-jade-soft hover:border-jade/30'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                disabled={page === pageCount}
                onClick={() => setPage((p) => p + 1)}
                className="size-8 flex items-center justify-center rounded-lg border border-rule text-ink-mute hover:bg-jade-soft hover:border-jade/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
