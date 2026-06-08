'use client';

import { useState } from 'react';
import { Banknote, Clock, TrendingUp, X, CheckCircle, ExternalLink, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { PAYOUTS } from '@/lib/mock-data';

const EXTRA_PAYOUTS = [
  { id: 'pay-7', date: '2025-11-01', amountIdr: 52000000, method: 'Bank transfer · BCA ****4821', status: 'completed', reference: 'BVP-2025-1101' },
  { id: 'pay-8', date: '2025-10-01', amountIdr: 45000000, method: 'Bank transfer · BCA ****4821', status: 'pending',   reference: 'BVP-2025-1001' },
];

const ALL_PAYOUTS = [...PAYOUTS, ...EXTRA_PAYOUTS].sort((a, b) => b.date.localeCompare(a.date));

const BALANCE_CARDS = [
  {
    key: 'available',
    label: 'Available balance',
    valueIdr: 82500000,
    sub: '≈ $5,322',
    note: 'Ready to withdraw',
    noteColor: 'text-success',
    icon: Banknote,
    iconBg: 'bg-jade-soft',
    iconColor: 'text-jade',
  },
  {
    key: 'pending',
    label: 'Pending balance',
    valueIdr: 19350000,
    sub: null,
    note: 'Bookings still in 24h hold',
    noteColor: 'text-mist-deep',
    icon: Clock,
    iconBg: 'bg-mist/20',
    iconColor: 'text-mist-deep',
  },
  {
    key: 'upcoming',
    label: 'Upcoming earnings',
    valueIdr: 43800000,
    sub: null,
    note: 'From confirmed future bookings',
    noteColor: 'text-mist-deep',
    icon: TrendingUp,
    iconBg: 'bg-gold/10',
    iconColor: 'text-gold',
  },
];

const STATUS_META = {
  completed: { label: 'Completed', cls: 'bg-jade/10 text-jade' },
  pending:   { label: 'Pending',   cls: 'bg-warn/10 text-warn' },
  failed:    { label: 'Failed',    cls: 'bg-danger/10 text-danger' },
};

const MIN_WITHDRAWAL = 5_000_000;

function fmtIdr(n) { return `Rp ${n.toLocaleString('id-ID')}`; }

export default function PayoutsPage() {
  const [showModal,  setShowModal]  = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState('82500000');

  const available = BALANCE_CARDS[0].valueIdr;
  const canWithdraw = available >= MIN_WITHDRAWAL;

  function handleWithdraw() {
    const amt = Number(withdrawAmt);
    if (!amt || amt < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal is ${fmtIdr(MIN_WITHDRAWAL)}`);
      return;
    }
    if (amt > available) {
      toast.error('Amount exceeds available balance');
      return;
    }
    toast.success(`Withdrawal of ${fmtIdr(amt)} initiated — arrives in 1–3 business days`);
    setShowModal(false);
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-ink">
          Payouts{' '}
          <span className="font-sans font-normal text-xl text-ink-mute">收款管理</span>
        </h1>
        <p className="text-sm text-ink-mute mt-1">
          Earnings from your 3 properties — paid to BCA ****4821
        </p>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BALANCE_CARDS.map(({ key, label, valueIdr, sub, note, noteColor, icon: Icon, iconBg, iconColor }) => (
          <div key={key} className="bg-surface rounded-xl border border-rule shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-ink-mute">{label}</span>
              <div className={`size-8 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon className={`size-4 ${iconColor}`} />
              </div>
            </div>
            <div>
              <p className="font-display text-3xl font-medium text-ink">
                {fmtIdr(valueIdr)}
              </p>
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
                Withdraw now
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payout history */}
      <div className="bg-surface rounded-xl border border-rule shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-rule">
          <h2 className="text-sm font-semibold text-ink">Payout history</h2>
          <p className="text-xs text-ink-mute mt-0.5">{ALL_PAYOUTS.length} payouts on record</p>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-rule">
          {ALL_PAYOUTS.map((p) => {
            const { label, cls } = STATUS_META[p.status] ?? { label: p.status, cls: 'bg-mist/10 text-mist' };
            return (
              <div key={p.id} className="px-5 py-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-semibold text-jade text-sm">{fmtIdr(p.amountIdr)}</p>
                  <p className="text-xs text-ink-mute mt-0.5 truncate">{p.date} · {p.method}</p>
                  <p className="font-mono text-[10px] text-ink-mute mt-0.5">{p.reference}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
                  {p.status === 'completed' && <CheckCircle className="size-3" />}
                  {label}
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
                {['Date', 'Amount', 'Method', 'Status', 'Reference', ''].map((h, i) => (
                  <th
                    key={h || i}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-mute whitespace-nowrap ${
                      h === 'Amount' ? 'text-right' : h === '' ? '' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PAYOUTS.map((p) => {
                const { label, cls } = STATUS_META[p.status] ?? { label: p.status, cls: 'bg-mist/10 text-mist' };
                return (
                  <tr key={p.id} className="border-b border-rule last:border-0 hover:bg-surface-alt/40 transition-colors">
                    <td className="px-5 py-3 text-sm text-ink whitespace-nowrap">{p.date}</td>
                    <td className="px-5 py-3 text-right font-mono font-semibold text-jade whitespace-nowrap">{fmtIdr(p.amountIdr)}</td>
                    <td className="px-5 py-3 text-sm text-ink-soft">{p.method}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
                        {p.status === 'completed' && <CheckCircle className="size-3" />}
                        {label}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-mute">{p.reference}</td>
                    <td className="px-5 py-3">
                      <button type="button" onClick={() => toast.info('Receipt download coming soon')} className="inline-flex items-center gap-1 text-xs font-semibold text-jade hover:text-jade-deep transition-colors">
                        <ExternalLink className="size-3" /> Receipt
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
            <h2 className="text-sm font-semibold text-ink">Banking information</h2>
            <p className="text-xs text-ink-mute mt-0.5">Where your payouts are sent</p>
          </div>
          <button
            type="button"
            onClick={() => toast.info('Re-verification required — check your email to continue')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-rule text-ink-soft hover:border-jade hover:text-jade transition-colors"
          >
            <Pencil className="size-3.5" /> Edit banking info
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Bank name',       value: 'Bank Central Asia (BCA)' },
            { label: 'Account holder',  value: 'Wayan Sudana' },
            { label: 'Account number',  value: '****  ****  4821' },
            { label: 'SWIFT / BIC',     value: 'CENAIDJA' },
            { label: 'Payout currency', value: 'IDR (Indonesian Rupiah)' },
            { label: 'Payout schedule', value: 'Within 24h of checkout' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-surface-alt rounded-lg p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-mute">{label}</p>
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
              <h3 className="text-lg font-semibold text-ink">Withdraw funds</h3>
              <button type="button" onClick={() => setShowModal(false)} className="size-7 flex items-center justify-center rounded-lg text-ink-mute hover:bg-surface-alt transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-jade-soft rounded-xl p-3.5 text-sm text-jade">
                Available: <span className="font-mono font-semibold">{fmtIdr(available)}</span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">
                  Withdrawal amount (IDR)
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
                  <span>Destination</span>
                  <span className="font-semibold text-ink">BCA ****4821 · Wayan Sudana</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated arrival</span>
                  <span className="font-semibold text-ink">1–3 business days</span>
                </div>
                <div className="flex justify-between">
                  <span>Minimum withdrawal</span>
                  <span className="font-mono text-ink">{fmtIdr(MIN_WITHDRAWAL)}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 h-10 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:bg-surface-alt transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={handleWithdraw} className="flex-1 h-10 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors">
                  Confirm withdrawal
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
