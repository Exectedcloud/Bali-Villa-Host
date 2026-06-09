'use client';

import { useState } from 'react';
import { Banknote, Clock, TrendingUp, X, CheckCircle, ExternalLink, Pencil, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { PAYOUTS } from '@/lib/mock-data';

const EXTRA_PAYOUTS = [
  { id: 'pay-7', date: '2025-11-01', amountIdr: 52000000, method: 'Bank transfer · BCA ****4821', status: 'completed', reference: 'BVP-2025-1101' },
  { id: 'pay-8', date: '2025-10-01', amountIdr: 45000000, method: 'Bank transfer · BCA ****4821', status: 'pending',   reference: 'BVP-2025-1001' },
];

const ALL_PAYOUTS = [...PAYOUTS, ...EXTRA_PAYOUTS].sort((a, b) => b.date.localeCompare(a.date));

const BALANCE_CARDS_DATA = [
  {
    key: 'available',
    valueIdr: 82500000,
    sub: '≈ $5,322',
    icon: Banknote,
    iconBg: 'bg-jade-soft',
    iconColor: 'text-jade',
  },
  {
    key: 'pending',
    valueIdr: 19350000,
    sub: null,
    icon: Clock,
    iconBg: 'bg-mist/20',
    iconColor: 'text-mist-deep',
  },
  {
    key: 'upcoming',
    valueIdr: 43800000,
    sub: null,
    icon: TrendingUp,
    iconBg: 'bg-gold/10',
    iconColor: 'text-gold',
  },
];

const STATUS_CLS = {
  completed: 'bg-jade/10 text-jade',
  pending:   'bg-warn/10 text-warn',
  failed:    'bg-danger/10 text-danger',
};

const MIN_WITHDRAWAL = 5_000_000;

function fmtIdr(n) { return `Rp ${n.toLocaleString('id-ID')}`; }

export default function PayoutsPage() {
  const t = useTranslations('payouts');
  const [showModal,   setShowModal]   = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState('82500000');

  const available = BALANCE_CARDS_DATA[0].valueIdr;
  const canWithdraw = available >= MIN_WITHDRAWAL;

  const NOTE_BY_KEY = {
    available: { note: t('balance.readyToWithdraw'),     noteColor: 'text-success' },
    pending:   { note: t('balance.bookingsOnHold'),       noteColor: 'text-mist-deep' },
    upcoming:  { note: t('balance.fromFutureBookings'),   noteColor: 'text-mist-deep' },
  };

  function handleWithdraw() {
    const amt = Number(withdrawAmt);
    if (!amt || amt < MIN_WITHDRAWAL) {
      toast.error(t('toast.errorMin', { amount: fmtIdr(MIN_WITHDRAWAL) }));
      return;
    }
    if (amt > available) {
      toast.error(t('toast.errorExceeds'));
      return;
    }
    toast.success(t('toast.initiated', { amount: fmtIdr(amt) }));
    setShowModal(false);
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-ink">{t('title')}</h1>
        <p className="text-sm text-ink-mute mt-1">{t('subtitle', { count: 3, account: 'BCA ****4821' })}</p>
      </div>

      {/* Airwallex disclaimer */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-jade-soft border border-jade/20 text-sm text-ink-soft">
        <Info className="size-4 text-jade shrink-0 mt-0.5" />
        <p>{t('airwallexNote')}</p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BALANCE_CARDS_DATA.map(({ key, valueIdr, sub, icon: Icon, iconBg, iconColor }) => {
          const { note, noteColor } = NOTE_BY_KEY[key];
          return (
            <div key={key} className="bg-surface rounded-xl border border-rule shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-mute">{t(`balance.${key}`)}</span>
                <div className={`size-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                  <Icon className={`size-4 ${iconColor}`} />
                </div>
              </div>
              <div>
                <p className="font-display text-3xl font-medium text-ink">{fmtIdr(valueIdr)}</p>
                {sub && <p className="font-mono text-xs text-mist mt-0.5">{sub}</p>}
              </div>
              <p className={`text-xs font-medium ${noteColor}`}>{note}</p>
              {key === 'available' && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  disabled={!canWithdraw}
                  className="mt-1 w-full h-9 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t('withdrawNow')}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Payout history */}
      <div className="bg-surface rounded-xl border border-rule shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-rule">
          <h2 className="text-sm font-semibold text-ink">{t('payoutHistory')}</h2>
          <p className="text-xs text-ink-mute mt-0.5">{t('payoutsOnRecord', { count: ALL_PAYOUTS.length })}</p>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-rule">
          {ALL_PAYOUTS.map((p) => {
            const statusLabel = t(`status.${p.status}`);
            const cls = STATUS_CLS[p.status] ?? 'bg-mist/10 text-mist';
            return (
              <div key={p.id} className="px-5 py-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-semibold text-jade text-sm">{fmtIdr(p.amountIdr)}</p>
                  <p className="text-xs text-ink-mute mt-0.5 truncate">{p.date} · {p.method}</p>
                  <p className="font-mono text-[10px] text-ink-mute mt-0.5">{p.reference}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
                  {p.status === 'completed' && <CheckCircle className="size-3" />}
                  {statusLabel}
                </span>
              </div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-rule bg-surface-alt/50">
                {[
                  { key: 'date',   label: t('table.date'),   align: 'text-left' },
                  { key: 'amount', label: t('table.amount'),  align: 'text-right' },
                  { key: 'method', label: t('table.method'),  align: 'text-left' },
                  { key: 'status', label: t('table.status'),  align: 'text-left' },
                  { key: 'ref',    label: t('table.reference'), align: 'text-left' },
                  { key: 'action', label: '',                 align: '' },
                ].map(({ key, label, align }) => (
                  <th key={key} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-mute whitespace-nowrap ${align}`}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PAYOUTS.map((p) => {
                const statusLabel = t(`status.${p.status}`);
                const cls = STATUS_CLS[p.status] ?? 'bg-mist/10 text-mist';
                return (
                  <tr key={p.id} className="border-b border-rule last:border-0 hover:bg-surface-alt/40 transition-colors">
                    <td className="px-5 py-3 text-sm text-ink whitespace-nowrap">{p.date}</td>
                    <td className="px-5 py-3 text-right font-mono font-semibold text-jade whitespace-nowrap">{fmtIdr(p.amountIdr)}</td>
                    <td className="px-5 py-3 text-sm text-ink-soft">{p.method}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
                        {p.status === 'completed' && <CheckCircle className="size-3" />}
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-mute">{p.reference}</td>
                    <td className="px-5 py-3">
                      <button type="button" onClick={() => toast.info(t('toast.receiptSoon'))} className="inline-flex items-center gap-1 text-xs font-semibold text-jade hover:text-jade-deep transition-colors">
                        <ExternalLink className="size-3" /> {t('receipt')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Banking info */}
      <div className="bg-surface rounded-xl border border-rule shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-ink">{t('bankingInfo')}</h2>
            <p className="text-xs text-ink-mute mt-0.5">{t('bankingInfoDesc')}</p>
          </div>
          <button
            type="button"
            onClick={() => toast.info(t('toast.bankEditNote'))}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rule text-ink-soft hover:border-jade hover:text-jade transition-colors"
          >
            <Pencil className="size-3.5" /> {t('editBankingInfo')}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { key: 'bankName',     value: 'Bank Central Asia (BCA)' },
            { key: 'accountHolder', value: 'Wayan Sudana' },
            { key: 'accountNumber', value: '****  ****  4821' },
            { key: 'swift',         value: 'CENAIDJA' },
            { key: 'currency',      value: 'IDR (Indonesian Rupiah)' },
            { key: 'schedule',      value: 'Within 24h of checkout' },
          ].map(({ key, value }) => (
            <div key={key} className="bg-surface-alt rounded-lg p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-mute">{t(`bankFields.${key}`)}</p>
              <p className="text-sm font-medium text-ink mt-1">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Withdrawal modal */}
      <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setShowModal(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            className="relative bg-surface rounded-2xl border border-rule shadow-xl w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-ink">{t('modal.title')}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="size-7 flex items-center justify-center rounded-lg text-ink-mute hover:bg-surface-alt transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-jade-soft rounded-xl p-3.5 text-sm text-jade">
                {t('modal.available', { amount: fmtIdr(available) })}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">
                  {t('modal.amountLabel')}
                </label>
                <input
                  type="number"
                  value={withdrawAmt}
                  onChange={(e) => setWithdrawAmt(e.target.value)}
                  className="w-full h-10 px-3 font-mono text-sm border border-rule rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-jade"
                />
              </div>

              <div className="bg-surface-alt rounded-xl p-3.5 text-xs text-ink-mute flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>{t('modal.destination')}</span>
                  <span className="font-semibold text-ink">BCA ****4821 · Wayan Sudana</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('modal.estimatedArrival')}</span>
                  <span className="font-semibold text-ink">1–3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('modal.minimumWithdrawal')}</span>
                  <span className="font-mono text-ink">{fmtIdr(MIN_WITHDRAWAL)}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:bg-surface-alt transition-colors">
                  {t('modal.cancel')}
                </button>
                <button type="button" onClick={handleWithdraw} className="flex-1 h-10 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors">
                  {t('modal.confirm')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
