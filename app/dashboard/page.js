'use client';

import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Star, BarChart3,
  Calendar, MessageSquare, Banknote, CheckCircle,
  ArrowRight, BookOpen, Home,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

function MetricCard({ metric }) {
  const { label, value, sub, trend, change, isRating, icon: Icon } = metric;
  return (
    <motion.div
      variants={cardVariants}
      className="bg-surface rounded-xl border border-rule p-3 sm:p-6 shadow-sm flex flex-col gap-2 sm:gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wide text-mist">{label}</span>
        <div className="size-8 rounded-lg bg-jade-soft flex items-center justify-center">
          <Icon className="size-4 text-jade" />
        </div>
      </div>
      <div>
        {isRating ? (
          <div className="flex items-baseline gap-1.5">
            <Star className="size-5 fill-gold text-gold self-center" />
            <span className="font-display text-2xl sm:text-4xl font-medium text-ink">{value}</span>
          </div>
        ) : (
          <p className="font-display text-2xl sm:text-4xl font-medium text-ink">{value}</p>
        )}
        {sub && <p className="text-xs text-mist font-mono mt-0.5">{sub}</p>}
      </div>
      {change && (
        <div className="flex items-center gap-1.5">
          {trend === 'up'   && <TrendingUp   className="size-3.5 text-success" />}
          {trend === 'down' && <TrendingDown className="size-3.5 text-danger" />}
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-ink-mute'}`}>
            {change}
          </span>
        </div>
      )}
    </motion.div>
  );
}

const STATUS_STYLE = {
  confirmed:        'bg-jade/10 text-jade',
  in_house:         'bg-success/10 text-success',
  pending_approval: 'bg-warn/10 text-warn',
  completed:        'bg-surface-alt text-ink-mute',
  cancelled:        'bg-danger/10 text-danger',
  draft:            'bg-surface-alt text-ink-mute',
};

function contextGreeting(firstName, bookings) {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 86400000);
  const checkInsThisWeek = bookings.filter((b) => {
    const d = new Date(b.checkIn);
    return d >= now && d <= weekFromNow && ['confirmed', 'in_house'].includes(b.status);
  });

  if (!firstName) return 'Welcome back.';
  if (bookings.length === 0) return `Welcome, ${firstName}. Let's get your first villa listed.`;
  if (checkInsThisWeek.length > 0)
    return `Welcome back, ${firstName}. You have ${checkInsThisWeek.length} check-in${checkInsThisWeek.length > 1 ? 's' : ''} this week.`;
  return `Welcome back, ${firstName}. Ready to fill more dates?`;
}

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const todayIso = new Date().toISOString().slice(0, 10);
  const now = new Date();

  const { data: meData }       = useQuery({ queryKey: ['host-me'],        queryFn: () => api.get('/host/me/') });
  const { data: bookingsData } = useQuery({ queryKey: ['host-bookings'],   queryFn: () => api.get('/host/bookings/') });
  const { data: convsData }    = useQuery({ queryKey: ['host-conversations'], queryFn: () => api.get('/host/conversations/') });

  const host     = meData?.host;
  const bookings = bookingsData?.bookings ?? [];
  const convs    = convsData?.conversations ?? [];

  const pendingCount = bookings.filter((b) => b.status === 'pending_approval').length;
  const unreadCount  = convs.reduce((sum, c) => sum + (c.unreadHost || 0), 0);

  const activeThisMonth = bookings.filter((b) => {
    const d = new Date(b.checkIn);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      && ['confirmed', 'in_house'].includes(b.status);
  });
  const revenueThisMonth = bookings
    .filter((b) => {
      const d = new Date(b.checkIn);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        && ['confirmed', 'in_house', 'completed'].includes(b.status);
    })
    .reduce((sum, b) => sum + (b.payoutIdr || 0), 0);

  const todayCheckIns  = bookings.filter((b) => b.checkIn  === todayIso && ['confirmed', 'in_house'].includes(b.status));
  const todayCheckOuts = bookings.filter((b) => b.checkOut === todayIso && ['in_house', 'completed'].includes(b.status));

  const firstName = host?.displayName?.split(' ')[0] ?? '';

  const METRICS = [
    { label: 'Bookings this month', value: String(activeThisMonth.length),                   icon: Calendar, trend: 'neutral', change: null },
    {
      label: 'Payout this month',
      value: revenueThisMonth ? `Rp ${(revenueThisMonth / 1_000_000).toFixed(0)}M` : 'Rp —',
      sub:   revenueThisMonth ? `≈ $${Math.round(revenueThisMonth / 15500).toLocaleString()}` : null,
      icon: Banknote, trend: 'neutral', change: null,
    },
    {
      label: 'Average rating',
      value: host?.avgRating ? host.avgRating.toFixed(1) : '—',
      sub:   host?.totalBookings ? `from ${host.totalBookings} bookings` : null,
      icon: Star, trend: 'neutral', isRating: true, change: null,
    },
    { label: 'Total bookings', value: host?.totalBookings != null ? String(host.totalBookings) : '—', icon: BarChart3, trend: 'neutral', change: null },
  ];

  const actionItems = [
    pendingCount > 0 && { id: 1, text: `${pendingCount} booking request${pendingCount > 1 ? 's' : ''} awaiting approval`, href: '/dashboard/reservations', action: 'Review', primary: true },
    unreadCount  > 0 && { id: 2, text: `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`,                      href: '/dashboard/messages',      action: 'Reply',  primary: true },
    { id: 3, text: 'Update calendar availability', href: '/dashboard/calendar', action: 'Edit', primary: false },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-medium text-ink">
            {contextGreeting(firstName, bookings)}
          </h1>
          <p className="text-sm text-mist mt-1">{today}</p>
        </div>
        <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.08, ease: 'linear' }} className="shrink-0">
          <Link
            href="/dashboard/listings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-jade hover:bg-jade-deep text-white text-sm font-semibold transition-colors"
          >
            <Home className="size-4" />
            View my listings
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>

      {/* Alert banners */}
      {(pendingCount > 0 || unreadCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {pendingCount > 0 && (
            <Link href="/dashboard/reservations" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warn/10 border border-warn/30 text-sm font-medium text-warn hover:bg-warn/15 transition-colors">
              <BookOpen className="size-4" />
              {pendingCount} booking{pendingCount > 1 ? 's' : ''} need approval
              <ArrowRight className="size-3.5" />
            </Link>
          )}
          {unreadCount > 0 && (
            <Link href="/dashboard/messages" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-jade-soft border border-jade/30 text-sm font-medium text-jade hover:bg-jade/10 transition-colors">
              <MessageSquare className="size-4" />
              {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      )}

      {/* Metric cards — stagger on mount */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
      >
        {METRICS.map((m) => <MetricCard key={m.label} metric={m} />)}
      </motion.div>

      {/* Today + action items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          {[
            { title: "Today's check-ins",  guests: todayCheckIns,  badge: 'bg-success/10 text-success' },
            { title: "Today's check-outs", guests: todayCheckOuts, badge: 'bg-jade-soft text-jade' },
          ].map(({ title, guests, badge }) => (
            <div key={title} className="bg-surface rounded-xl border border-rule shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
                <h2 className="text-sm font-semibold text-ink">{title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>{guests.length} guests</span>
              </div>
              <div className="px-5">
                {guests.length === 0 && <p className="text-xs text-ink-mute py-4 text-center">None today</p>}
                {guests.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 py-3 border-b border-rule last:border-0">
                    <img src={b.guestAvatarUrl || ''} alt={b.guestName} className="size-9 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{b.guestName}</p>
                      <p className="text-xs text-ink-mute truncate">{b.villa?.titleEn}</p>
                    </div>
                    <span className="text-xs text-ink-mute shrink-0">{b.nights} nights</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface rounded-xl border border-rule shadow-sm">
          <div className="px-5 py-4 border-b border-rule">
            <h2 className="text-sm font-semibold text-ink">Action items</h2>
            <p className="text-xs text-ink-mute mt-0.5">Tasks that need your attention</p>
          </div>
          <div className="divide-y divide-rule">
            {actionItems.length === 0 && <p className="text-xs text-ink-mute p-5 text-center">All caught up!</p>}
            {actionItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 px-5 py-4">
                <CheckCircle className="size-4 text-ink-mute mt-0.5 shrink-0" />
                <p className="flex-1 text-sm text-ink leading-snug">{item.text}</p>
                <Link
                  href={item.href}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${item.primary ? 'bg-jade text-white hover:bg-jade-deep' : 'border border-rule text-ink-soft hover:border-jade hover:text-jade'}`}
                >
                  {item.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-surface rounded-xl border border-rule shadow-sm">
        <div className="px-5 py-4 border-b border-rule flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Recent bookings</h2>
          <Link href="/dashboard/reservations" className="text-xs text-jade hover:text-jade-deep font-medium transition-colors">View all</Link>
        </div>
        <div className="divide-y divide-rule">
          {bookings.length === 0 && <p className="text-xs text-ink-mute p-5 text-center">No bookings yet</p>}
          {bookings.slice(0, 6).map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-5 py-4">
              <img src={b.guestAvatarUrl || ''} alt={b.guestName} className="size-8 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-ink truncate">{b.guestName} · {b.villa?.titleEn} · {b.nights} nights</p>
                <p className="text-xs text-ink-mute">{b.checkIn} → {b.checkOut}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_STYLE[b.status] || 'bg-surface-alt text-ink-mute'}`}>
                {b.status.replace(/_/g, ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
