'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Dot, MessageSquare, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

const STATUS_META = {
  confirmed:        { label: 'Confirmed',        cls: 'bg-jade/10 text-jade' },
  in_house:         { label: 'In-house',          cls: 'bg-success/10 text-success' },
  completed:        { label: 'Completed',         cls: 'bg-mist/20 text-mist-deep' },
  pending_approval: { label: 'Pending approval',  cls: 'bg-warn/10 text-warn' },
  pending_payment:  { label: 'Pending payment',   cls: 'bg-warn/10 text-warn' },
  cancelled:        { label: 'Cancelled',         cls: 'bg-danger/10 text-danger' },
};

const TIMELINE_STEPS = [
  'Booking created',
  'Payment confirmed',
  'Check-in due',
  'Checked in',
  'Checked out',
  'Review received',
  'Payout sent',
];

function timelineProgress(status) {
  if (status === 'pending_approval') return 0;
  if (status === 'confirmed')        return 2;
  if (status === 'in_house')         return 3;
  if (status === 'completed')        return 5;
  return 1;
}

function fmtIdr(n) { return `Rp ${Number(n).toLocaleString('id-ID')}`; }

export default function ReservationDetailPage() {
  const { id } = useParams();
  const qc = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ['host-booking', id],
    queryFn: () => api.get(`/host/bookings/${id}/`),
  });
  const bk = data?.booking;

  const approveMutation = useMutation({
    mutationFn: () => api.post(`/host/bookings/${id}/approve/`, {}),
    onSuccess: () => {
      toast.success(`Booking ${bk?.reference ?? id} approved`);
      qc.invalidateQueries({ queryKey: ['host-booking', id] });
      qc.invalidateQueries({ queryKey: ['host-bookings'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to approve booking.'),
  });

  const declineMutation = useMutation({
    mutationFn: () => api.post(`/host/bookings/${id}/decline/`, {}),
    onSuccess: () => {
      toast.error(`Booking ${bk?.reference ?? id} declined`);
      qc.invalidateQueries({ queryKey: ['host-booking', id] });
      qc.invalidateQueries({ queryKey: ['host-bookings'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to decline booking.'),
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4 max-w-5xl">
        <div className="h-8 w-48 rounded-lg bg-surface-alt animate-pulse" />
        <div className="h-64 rounded-xl bg-surface-alt animate-pulse" />
      </div>
    );
  }

  if (!bk) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-lg font-medium text-ink">Reservation not found</p>
        <Link href="/dashboard/reservations" className="text-sm text-jade hover:text-jade-deep font-medium transition-colors">
          ← Back to reservations
        </Link>
      </div>
    );
  }

  const villa = bk.villa;
  const { label: statusLabel, cls: statusCls } = STATUS_META[bk.status] ?? { label: bk.status, cls: '' };
  const ref  = bk.reference ?? `#${bk.id}`;
  const step = timelineProgress(bk.status);

  const nightlyRate = Math.round(bk.totalIdr / Math.max(bk.nights, 1) / 1.21 / 1000) * 1000;
  const nightsTotal = nightlyRate * bk.nights;
  const cleaningFee = 350_000;
  const serviceFee  = Math.round(nightsTotal * 0.10 / 1000) * 1000;
  const commission  = bk.totalIdr - bk.payoutIdr;
  const fxRate      = bk.totalCny > 0 ? (bk.totalIdr / bk.totalCny).toFixed(4) : '—';

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/reservations"
            className="inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-ink transition-colors"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <span className="text-ink-mute">/</span>
          <span className="font-mono text-sm font-semibold text-ink">{ref}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusCls}`}>{statusLabel}</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Guest info */}
          <div className="bg-surface rounded-xl border border-rule shadow-sm p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-ink">Guest</h2>
            <div className="flex items-center gap-3">
              {bk.guestAvatarUrl ? (
                <img src={bk.guestAvatarUrl} alt={bk.guestName} className="size-12 rounded-full object-cover shrink-0" />
              ) : (
                <div className="size-12 rounded-full bg-jade-soft flex items-center justify-center text-jade font-semibold shrink-0">
                  {(bk.guestName || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-ink">{bk.guestName}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-ink-mute">
                  <span>{bk.guestEmail ?? '—'}</span>
                  {bk.guestPhone && <><span>·</span><span>{bk.guestPhone}</span></>}
                </div>
              </div>
              <Link
                href="/dashboard/messages"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rule text-xs font-semibold text-ink-soft hover:border-jade hover:text-jade transition-colors"
              >
                <MessageSquare className="size-3.5" />
                Message
              </Link>
            </div>
            {bk.guestNote && (
              <div className="bg-warn/5 border border-warn/20 rounded-lg px-3 py-2.5 text-xs text-ink-soft leading-relaxed">
                <span className="font-semibold text-warn block mb-0.5">Special requests</span>
                {bk.guestNote}
              </div>
            )}
          </div>

          {/* Stay details */}
          <div className="bg-surface rounded-xl border border-rule shadow-sm p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-ink">Stay details</h2>
            {villa && (
              <div className="flex items-center gap-3 pb-3 border-b border-rule">
                <img src={villa.photos?.[0] ?? ''} alt={villa.titleEn} className="size-12 rounded-lg object-cover shrink-0" />
                <div>
                  <p className="font-semibold text-ink">{villa.titleEn}</p>
                  <p className="text-xs text-ink-mute mt-0.5">{villa.region}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Check-in',  value: bk.checkIn  },
                { label: 'Check-out', value: bk.checkOut },
                { label: 'Nights',    value: `${bk.nights} nights` },
                { label: 'Guests',    value: `${bk.adults} adults${bk.children ? `, ${bk.children} children` : ''}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface-alt rounded-lg p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-mute">{label}</p>
                  <p className="text-sm font-semibold text-ink mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment breakdown */}
          <div className="bg-surface rounded-xl border border-rule shadow-sm p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ink">Payment breakdown</h2>
            <div className="flex flex-col gap-2 text-sm">
              {[
                { label: `Nightly rate × ${bk.nights} nights`, value: fmtIdr(nightsTotal) },
                { label: 'Cleaning fee',  value: fmtIdr(cleaningFee) },
                { label: 'Service fee',   value: fmtIdr(serviceFee) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-ink-mute">{label}</span>
                  <span className="font-mono text-ink-soft">{value}</span>
                </div>
              ))}

              <div className="border-t border-rule pt-2 mt-1 flex justify-between font-semibold">
                <span className="text-ink">Total (IDR)</span>
                <span className="font-mono text-ink">{fmtIdr(bk.totalIdr)}</span>
              </div>

              {bk.totalCny > 0 && (
                <div className="bg-jade-soft rounded-lg px-3 py-2 flex justify-between text-xs">
                  <span className="text-jade font-medium">Guest paid (CNY)</span>
                  <span className="font-mono font-semibold text-jade">
                    ¥{bk.totalCny.toLocaleString()} <span className="font-normal text-jade/70">at {fxRate} IDR/¥</span>
                  </span>
                </div>
              )}

              <div className="flex justify-between text-danger/90">
                <span>BaliVilla commission (14%)</span>
                <span className="font-mono">− {fmtIdr(commission)}</span>
              </div>

              <div className="border-t border-rule pt-2 mt-1 flex justify-between items-baseline">
                <span className="text-sm font-semibold text-ink">Your payout</span>
                <span className="font-mono text-xl font-bold text-jade">{fmtIdr(bk.payoutIdr)}</span>
              </div>
            </div>
          </div>

          {/* Booking timeline */}
          <div className="bg-surface rounded-xl border border-rule shadow-sm p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Booking timeline</h2>
            <div className="flex flex-col gap-0">
              {TIMELINE_STEPS.map((label, i) => {
                const done    = i < step;
                const current = i === step;
                return (
                  <div key={label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`size-6 rounded-full flex items-center justify-center shrink-0 ${
                        done    ? 'bg-jade text-white' :
                        current ? 'bg-jade-soft ring-2 ring-jade' :
                                  'bg-surface-alt'
                      }`}>
                        {done ? (
                          <CheckCircle2 className="size-4" />
                        ) : current ? (
                          <Dot className="size-5 text-jade" />
                        ) : (
                          <Circle className="size-3.5 text-ink-mute/40" />
                        )}
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && (
                        <div className={`w-px flex-1 my-1 ${done ? 'bg-jade/40' : 'bg-rule'}`} style={{ minHeight: 20 }} />
                      )}
                    </div>
                    <div className="pb-4 pt-0.5">
                      <p className={`text-sm font-medium ${
                        done    ? 'text-jade' :
                        current ? 'text-ink font-semibold' :
                                  'text-ink-mute'
                      }`}>
                        {label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN — sticky action panel ── */}
        <div className="lg:w-72 shrink-0 w-full lg:sticky lg:top-6">
          <div className="bg-surface rounded-xl border border-rule shadow-sm p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ink">Actions</h2>
            <p className="text-xs text-ink-mute -mt-1">{ref} · {bk.nights} nights</p>

            {bk.status === 'pending_approval' && (
              <>
                <button
                  type="button"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending}
                  className="w-full h-10 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-50 transition-colors"
                >
                  {approveMutation.isPending ? 'Approving…' : 'Approve booking'}
                </button>
                <button
                  type="button"
                  onClick={() => declineMutation.mutate()}
                  disabled={declineMutation.isPending}
                  className="w-full h-10 rounded-xl border border-danger/30 text-danger text-sm font-semibold hover:bg-danger/5 disabled:opacity-50 transition-colors"
                >
                  {declineMutation.isPending ? 'Declining…' : 'Decline booking'}
                </button>
              </>
            )}

            {bk.status === 'confirmed' && (
              <>
                <button
                  type="button"
                  onClick={() => toast.success('Check-in marked')}
                  className="w-full h-10 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors"
                >
                  Mark check-in
                </button>
                <Link
                  href="/dashboard/messages"
                  className="w-full h-10 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:border-jade hover:text-jade transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="size-4" /> Message guest
                </Link>
                <button
                  type="button"
                  onClick={() => toast.error('Booking cancelled')}
                  className="w-full h-10 rounded-xl border border-danger/20 text-danger text-sm font-semibold hover:bg-danger/5 transition-colors"
                >
                  Cancel booking
                </button>
              </>
            )}

            {bk.status === 'in_house' && (
              <>
                <button
                  type="button"
                  onClick={() => toast.success('Check-out marked — great stay!')}
                  className="w-full h-10 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors"
                >
                  Mark check-out
                </button>
                <Link
                  href="/dashboard/messages"
                  className="w-full h-10 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:border-jade hover:text-jade transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="size-4" /> Message guest
                </Link>
                <button
                  type="button"
                  onClick={() => toast.info('Support team notified')}
                  className="w-full h-10 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:border-warn hover:text-warn transition-colors flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="size-4" /> Report issue
                </button>
              </>
            )}

            {bk.status === 'completed' && (
              <>
                <button
                  type="button"
                  onClick={() => toast.info('Review feature coming soon')}
                  className="w-full h-10 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep transition-colors"
                >
                  View review
                </button>
                <Link
                  href="/dashboard/messages"
                  className="w-full h-10 rounded-xl border border-rule text-sm font-semibold text-ink-soft hover:border-jade hover:text-jade transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="size-4" /> Message guest
                </Link>
              </>
            )}

            {/* Payout summary */}
            <div className="mt-2 border-t border-rule pt-3">
              <p className="text-xs text-ink-mute mb-1">Your payout</p>
              <p className="font-mono text-lg font-bold text-jade">{fmtIdr(bk.payoutIdr)}</p>
              {bk.totalCny > 0 && (
                <p className="font-mono text-xs text-mist mt-0.5">≈ ¥{bk.totalCny.toLocaleString()}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
