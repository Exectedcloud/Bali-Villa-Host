'use client';

import { useState } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Star, FlaskConical } from 'lucide-react';
import { useTranslations } from 'next-intl';

const MONTH_KEYS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

const REVENUE_DATA = [
  15200000, 16800000, 15900000, 17200000, 18500000, 19800000,
  22400000, 21100000, 20300000, 23600000, 25900000, 27800000,
].map((v, i) => ({ month: MONTH_KEYS[i], value: v }));

const OCCUPANCY_DATA = [
  52, 68, 61, 55, 74, 80, 85, 79, 71, 77, 83, 81,
].map((v, i) => ({ month: MONTH_KEYS[i], value: v }));

const ADR_DATA = [
  3800000, 4200000, 4050000, 3950000, 4500000, 4800000,
  5200000, 5050000, 4900000, 5400000, 5700000, 6100000,
].map((v, i) => ({ month: MONTH_KEYS[i], value: v }));

const RATING_DATA = [
  4.6, 4.7, 4.6, 4.7, 4.8, 4.8, 4.9, 4.8, 4.9, 4.9, 5.0, 4.9,
].map((v, i) => ({ month: MONTH_KEYS[i], value: v }));

const SOURCE_DATA = [
  { name: 'Direct',   value: 45, color: '#1F6B5C' },
  { name: 'Search',   value: 30, color: '#C9A961' },
  { name: 'Wishlist', value: 25, color: '#9BB8B0' },
];

const TOP_VILLAS = [
  { name: 'Villa Tjampuhan Ubud',   bookings: 8,  revenueM: 142, rating: 9.4, occupancy: 78 },
  { name: 'Villa Bukit Nusa Dua',   bookings: 6,  revenueM: 389, rating: 9.6, occupancy: 72 },
  { name: 'Villa Sindhu Sanur',     bookings: 7,  revenueM: 168, rating: 9.2, occupancy: 65 },
];

const TIME_RANGE_KEYS = ['last30', 'last90', 'lastYear', 'allTime'];

function RpTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-rule rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-ink-mute mb-1">{label}</p>
      <p className="font-mono font-semibold text-jade">Rp {(payload[0].value / 1_000_000).toFixed(1)}M</p>
    </div>
  );
}

function PctTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-rule rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-ink-mute mb-1">{label}</p>
      <p className="font-mono font-semibold text-mist-deep">{payload[0].value}%</p>
    </div>
  );
}

function AdrTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-rule rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-ink-mute mb-1">{label}</p>
      <p className="font-mono font-semibold text-jade-deep">Rp {(payload[0].value / 1_000_000).toFixed(2)}M</p>
    </div>
  );
}

function RatingTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-rule rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="text-ink-mute mb-1">{label}</p>
      <p className="font-mono font-semibold text-gold">{payload[0].value.toFixed(1)} ★</p>
    </div>
  );
}

function SourceTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-rule rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-ink">{payload[0].name}</p>
      <p className="font-mono text-ink-soft mt-0.5">{payload[0].value}%</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-surface rounded-xl border border-rule shadow-sm p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-ink-mute mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

const AXIS_STYLE = { fontSize: 11, fill: '#8A7560' };

export default function InsightsPage() {
  const t = useTranslations('insights');
  const [range, setRange] = useState('lastYear');

  return (
    <div className="flex flex-col gap-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink">{t('title')}</h1>
          <p className="text-sm text-ink-mute mt-1">{t('subtitle', { count: 3 })}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warn/10 border border-warn/20 text-xs text-warn font-medium">
            <FlaskConical className="size-3.5 shrink-0" />
            {t('sampleData')}
          </div>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="h-9 pl-3 pr-8 text-sm border border-rule rounded-lg bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-jade appearance-none"
          >
            {TIME_RANGE_KEYS.map((key) => (
              <option key={key} value={key}>{t(`timeRanges.${key}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

        <ChartCard title={t('charts.revenue')} subtitle={t('charts.revenueSubtitle')}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={REVENUE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8CAB0" vertical={false} />
              <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} width={36} />
              <Tooltip content={<RpTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#1F6B5C" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#1F6B5C' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('charts.occupancy')} subtitle={t('charts.occupancySubtitle', { count: 3 })}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={OCCUPANCY_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8CAB0" vertical={false} />
              <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[40, 100]} tickFormatter={(v) => `${v}%`} width={36} />
              <Tooltip content={<PctTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#9BB8B0" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#9BB8B0' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('charts.bookingSources')} subtitle={t('charts.bookingSourcesSubtitle')}>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={SOURCE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {SOURCE_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<SourceTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 flex-1">
              {SOURCE_DATA.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-sm text-ink-soft flex-1">{s.name}</span>
                  <span className="font-mono text-sm font-semibold text-ink">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title={t('charts.adr')} subtitle={t('charts.adrSubtitle')}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ADR_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D8CAB0" vertical={false} />
              <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} width={40} />
              <Tooltip content={<AdrTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#144A3F" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#144A3F' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard title={t('charts.reviewScore')} subtitle={t('charts.reviewScoreSubtitle')}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={RATING_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8CAB0" vertical={false} />
                <XAxis dataKey="month" tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} domain={[4.4, 5.1]} tickFormatter={(v) => v.toFixed(1)} width={32} />
                <Tooltip content={<RatingTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#C9A961" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#C9A961' }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Top performing villas */}
      <div className="bg-surface rounded-xl border border-rule shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-rule flex items-center gap-2">
          <TrendingUp className="size-4 text-jade" />
          <h2 className="text-sm font-semibold text-ink">{t('topProperties')}</h2>
          <span className="text-xs text-ink-mute ml-1">— {t(`timeRanges.${range}`)}</span>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-rule">
          {TOP_VILLAS.map((v, i) => (
            <div key={v.name} className="px-5 py-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="size-5 rounded-full bg-jade-soft text-jade text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="font-medium text-ink text-sm">{v.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink-mute">
                <span>{v.bookings} bookings · <span className="font-mono text-jade font-semibold">Rp {v.revenueM}M</span></span>
                <span className="flex items-center gap-1"><Star className="size-3 fill-gold text-gold" />{v.rating} · {v.occupancy}% occ.</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full text-sm">
          <thead>
            <tr className="border-b border-rule bg-surface-alt/50">
              {[
                { key: 'villa',     label: t('table.villa') },
                { key: 'bookings',  label: t('table.bookings') },
                { key: 'revenue',   label: t('table.revenue') },
                { key: 'avgRating', label: t('table.avgRating') },
                { key: 'occupancy', label: t('table.occupancy') },
              ].map(({ key, label }, i) => (
                <th key={key} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-mute ${i === 0 ? 'text-left' : 'text-right'}`}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOP_VILLAS.map((v, i) => (
              <tr key={v.name} className="border-b border-rule last:border-0 hover:bg-surface-alt/40 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="size-5 rounded-full bg-jade-soft text-jade text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="font-medium text-ink">{v.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right font-mono text-ink-soft">{v.bookings}</td>
                <td className="px-5 py-3 text-right font-mono font-semibold text-jade">Rp {v.revenueM}M</td>
                <td className="px-5 py-3 text-right">
                  <span className="inline-flex items-center gap-1 font-mono text-ink-soft">
                    <Star className="size-3 fill-gold text-gold" /> {v.rating}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="inline-flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 rounded-full bg-rule overflow-hidden">
                      <div className="h-full rounded-full bg-mist" style={{ width: `${v.occupancy}%` }} />
                    </div>
                    <span className="font-mono text-ink-soft text-xs w-8">{v.occupancy}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
