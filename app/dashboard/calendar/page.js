'use client';

import { useState, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Lock, X,
  CalendarDays, Pencil, Trash2, Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api-client';
import CalendarGrid from '@/components/host/CalendarGrid';
import Avatar from '@/components/ui/Avatar';

const SEASONAL_RULES = [
  { id: 1, name: 'Chinese New Year', dates: 'Jan 28 – Feb 5, 2027', markup: '+30%' },
  { id: 2, name: 'Peak Season (Jul–Aug)', dates: 'Jul 1 – Aug 31, 2026', markup: '+50%' },
  { id: 3, name: 'Year-end Holiday', dates: 'Dec 22 – Jan 5, 2027', markup: '+40%' },
];

function formatDate(year, month, day) {
  return new Date(year, month, day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CalendarPage() {
  const t = useTranslations('calendar');
  const tCommon = useTranslations('common');
  const qc = useQueryClient();
  const [year, setYear]               = useState(new Date().getFullYear());
  const [month, setMonth]             = useState(new Date().getMonth());
  const [villaFilter, setVillaFilter] = useState('mobile-first');
  const [selectedCell, setSelectedCell]   = useState(null);
  const [selectionRange, setSelectionRange] = useState(null);
  const [panelPrice, setPanelPrice]     = useState('');
  const [rules, setRules]               = useState(SEASONAL_RULES);
  const dragStartRef = useRef(null);

  const { data: villasData } = useQuery({ queryKey: ['host-villas'], queryFn: () => api.get('/host/villas/') });
  const { data: bookingsData } = useQuery({ queryKey: ['host-bookings'], queryFn: () => api.get('/host/bookings/') });

  const allVillas = villasData?.villas ?? [];
  const allBookings = bookingsData?.bookings ?? [];

  const approveMutation = useMutation({
    mutationFn: (id) => api.post(`/host/bookings/${id}/approve/`, {}),
    onSuccess: () => { toast.success(t('toast.approved')); qc.invalidateQueries({ queryKey: ['host-bookings'] }); clearSelection(); },
    onError: () => toast.error(t('toast.errorApprove')),
  });
  const declineMutation = useMutation({
    mutationFn: (id) => api.post(`/host/bookings/${id}/decline/`, {}),
    onSuccess: () => { toast.success(t('toast.declined')); qc.invalidateQueries({ queryKey: ['host-bookings'] }); clearSelection(); },
    onError: () => toast.error(t('toast.errorDecline')),
  });

  const LEGEND = [
    { cls: 'bg-jade/80',                    label: t('legend.booked') },
    { cls: 'bg-gold/20 border border-gold/50', label: t('legend.pending') },
    { cls: 'bg-surface-alt',                label: t('legend.blocked') },
    { cls: 'bg-surface border border-rule', label: t('legend.available') },
    { cls: 'bg-jade-soft border border-jade/30', label: t('legend.selected') },
  ];

  const shownVillas = villaFilter === 'all'
    ? allVillas
    : villaFilter === 'mobile-first'
    ? allVillas.slice(0, 1)
    : allVillas.filter((v) => String(v.id) === villaFilter);

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11); }
    else setMonth((m) => m - 1);
    clearSelection();
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0); }
    else setMonth((m) => m + 1);
    clearSelection();
  }
  function goToday() { const d = new Date(); setYear(d.getFullYear()); setMonth(d.getMonth()); clearSelection(); }
  function clearSelection() { setSelectedCell(null); setSelectionRange(null); setPanelPrice(''); }

  const handleCellMouseDown = useCallback((villaId, day, state) => {
    if (state.type === 'blocked') return;
    if (state.type === 'booked' || state.type === 'pending') {
      dragStartRef.current = null;
      setSelectedCell({ villaId, day, state });
      setSelectionRange(null);
      return;
    }
    dragStartRef.current = { villaId, day };
    setSelectedCell({ villaId, day, state });
    setSelectionRange({ villaId, start: day, end: day });
  }, []);

  const handleCellMouseEnter = useCallback((villaId, day) => {
    if (!dragStartRef.current) return;
    if (dragStartRef.current.villaId !== villaId) return;
    setSelectionRange((prev) => prev ? { ...prev, end: day } : null);
  }, []);

  const handleCellMouseUp = useCallback(() => {
    dragStartRef.current = null;
  }, []);

  function handleSavePrice() {
    if (!panelPrice) return;
    const fmt = Number(panelPrice).toLocaleString('id-ID');
    toast.success(t('toast.priceSaved', { price: fmt }));
    clearSelection();
  }

  function handleBlock() {
    toast.success(t('toast.datesBlocked'));
    clearSelection();
  }

  function handleApprove(bookingId) { approveMutation.mutate(bookingId); }
  function handleDecline(bookingId) { declineMutation.mutate(bookingId); }

  function removeRule(id) {
    setRules((prev) => prev.filter((r) => r.id !== id));
    toast.success(t('toast.ruleRemoved'));
  }

  const panel = (() => {
    if (!selectedCell) return null;
    const { villaId, day, state } = selectedCell;
    const villa = allVillas.find((v) => v.id === villaId);
    if (!villa) return null;
    if (state.type === 'booked' || state.type === 'pending') {
      return { kind: state.type, villa, bk: state.booking };
    }
    if (selectionRange) {
      const lo = Math.min(selectionRange.start, selectionRange.end);
      const hi = Math.max(selectionRange.start, selectionRange.end);
      return { kind: lo === hi ? 'available' : 'range', villa, lo, hi, day };
    }
    return { kind: 'available', villa, lo: day, hi: day, day };
  })();

  const monthLabel = new Date(year, month, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const nowDate = new Date();
  const isCurrentPeriod = year === nowDate.getFullYear() && month === nowDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="flex flex-col gap-6 max-w-[1300px]">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-medium text-ink">{t('title')}</h1>
        <p className="text-sm text-ink-mute mt-1">{t('subtitle')}</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={villaFilter}
          onChange={(e) => { setVillaFilter(e.target.value); clearSelection(); }}
          className="h-11 pl-3 pr-8 text-sm border border-rule rounded-lg bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-jade appearance-none"
        >
          <option value="all">{t('allVillas', { count: allVillas.length })}</option>
          {allVillas.map((v) => (
            <option key={v.id} value={String(v.id)}>{v.titleEn}</option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button type="button" onClick={prevMonth} className="size-9 flex items-center justify-center rounded-lg border border-rule bg-surface hover:bg-jade-soft hover:border-jade/30 transition-colors" aria-label="Previous month">
            <ChevronLeft className="size-4 text-ink-mute" />
          </button>
          <span className="px-3 text-sm font-semibold text-ink min-w-[148px] text-center">{monthLabel}</span>
          <button type="button" onClick={nextMonth} className="size-9 flex items-center justify-center rounded-lg border border-rule bg-surface hover:bg-jade-soft hover:border-jade/30 transition-colors" aria-label="Next month">
            <ChevronRight className="size-4 text-ink-mute" />
          </button>
          {!isCurrentPeriod && (
            <button type="button" onClick={goToday} className="ml-1 px-3 h-9 text-xs font-semibold border border-rule rounded-lg bg-surface text-ink-soft hover:bg-jade-soft hover:border-jade/30 transition-colors">
              {t('today')}
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3 flex-wrap">
          {LEGEND.map(({ cls, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-xs text-ink-mute">
              <span className={`inline-block size-3 rounded-sm shrink-0 ${cls}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Grid + side panel */}
      <div className="flex gap-5 items-start">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={`${year}-${month}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <CalendarGrid
                villas={shownVillas}
                year={year}
                month={month}
                bookings={allBookings}
                selectedCell={selectedCell}
                selectionRange={selectionRange}
                onCellMouseDown={handleCellMouseDown}
                onCellMouseEnter={handleCellMouseEnter}
                onCellMouseUp={handleCellMouseUp}
              />
            </motion.div>
          </AnimatePresence>
          <p className="mt-2 text-[11px] text-ink-mute">
            <CalendarDays className="inline size-3 mr-1" />
            {t('showing', { count: shownVillas.length, days: daysInMonth })}
          </p>
        </div>

        {/* Side panel */}
        {panel && (
          <div className="w-72 shrink-0 bg-surface rounded-xl border border-rule shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-rule">
              <h3 className="text-sm font-semibold text-ink leading-tight">
                {panel.kind === 'booked'  ? t('panel.bookingDetails') :
                 panel.kind === 'pending' ? t('panel.pendingApproval') :
                 panel.kind === 'range'   ? t('panel.daysSelected', { count: panel.hi - panel.lo + 1 }) :
                                           t('panel.dateDetails')}
              </h3>
              <button type="button" onClick={clearSelection} className="size-6 flex items-center justify-center rounded-md text-ink-mute hover:bg-surface-alt transition-colors">
                <X className="size-3.5" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center gap-2 p-2 bg-surface-alt rounded-lg">
                <img src={panel.villa.photos?.[0] ?? ''} alt="" className="size-7 rounded-md object-cover shrink-0" />
                <p className="text-[11px] font-semibold text-ink leading-tight truncate">{panel.villa.titleEn}</p>
              </div>

              {(panel.kind === 'booked' || panel.kind === 'pending') && panel.bk && (
                <>
                  <div className="flex items-center gap-2.5">
                    <Avatar src={panel.bk.guestAvatarUrl} name={panel.bk.guestName} size={36} />
                    <div>
                      <p className="text-sm font-semibold text-ink">{panel.bk.guestName}</p>
                      <p className="text-xs text-ink-mute">
                        {panel.bk.adults + (panel.bk.children ?? 0)} guests · {panel.bk.nights} nights
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-surface-alt rounded-lg p-2.5">
                      <p className="text-[10px] text-ink-mute font-semibold uppercase tracking-wide">{t('panel.checkIn')}</p>
                      <p className="text-xs font-semibold text-ink mt-1">{panel.bk.checkIn}</p>
                    </div>
                    <div className="bg-surface-alt rounded-lg p-2.5">
                      <p className="text-[10px] text-ink-mute font-semibold uppercase tracking-wide">{t('panel.checkOut')}</p>
                      <p className="text-xs font-semibold text-ink mt-1">{panel.bk.checkOut}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ink-mute">{t('panel.totalCharged')}</span>
                      <span className="font-mono font-semibold text-jade">¥{panel.bk.totalCny.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-mute">{t('panel.yourPayout')}</span>
                      <span className="font-mono text-mist-deep">≈ Rp {panel.bk.payoutIdr.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {panel.kind === 'pending' && (
                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={() => handleApprove(panel.bk.id)} disabled={approveMutation.isPending} className="flex-1 h-8 text-xs font-semibold bg-jade text-white rounded-lg hover:bg-jade-deep disabled:opacity-50 transition-colors">
                        {tCommon('approve')}
                      </button>
                      <button type="button" onClick={() => handleDecline(panel.bk.id)} disabled={declineMutation.isPending} className="flex-1 h-8 text-xs font-semibold border border-rule text-ink-soft rounded-lg hover:border-danger hover:text-danger disabled:opacity-50 transition-colors">
                        {tCommon('decline')}
                      </button>
                    </div>
                  )}
                </>
              )}

              {(panel.kind === 'available' || panel.kind === 'range') && (
                <>
                  <p className="text-xs text-ink-mute -mt-1">
                    {panel.kind === 'range'
                      ? `${formatDate(year, month, panel.lo)} – ${formatDate(year, month, panel.hi)}`
                      : formatDate(year, month, panel.day)}
                  </p>

                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wide text-ink-mute block mb-1.5">
                      {t('panel.pricePerNight')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={panelPrice}
                        onChange={(e) => setPanelPrice(e.target.value)}
                        placeholder={panel.villa.basePriceIdr.toLocaleString('id-ID')}
                        className="flex-1 h-8 px-2.5 text-xs border border-rule rounded-lg bg-surface focus:outline-none focus:ring-1 focus:ring-jade font-mono placeholder:text-ink-mute/50"
                      />
                      <button type="button" onClick={handleSavePrice} className="px-3 h-8 text-xs font-semibold bg-jade text-white rounded-lg hover:bg-jade-deep transition-colors shrink-0">
                        {t('panel.save')}
                      </button>
                    </div>
                    {panelPrice && (
                      <p className="text-[10px] text-mist mt-1.5 font-mono">
                        ≈ ¥{Math.round(Number(panelPrice) / 2.16).toLocaleString()} per night
                      </p>
                    )}
                  </div>

                  <div className="border-t border-rule pt-3">
                    <button type="button" onClick={handleBlock} className="w-full h-8 text-xs font-semibold border border-rule text-ink-soft rounded-lg hover:border-danger hover:text-danger transition-colors flex items-center justify-center gap-1.5">
                      <Lock className="size-3" />
                      {panel.kind === 'range' ? t('panel.blockDates') : t('panel.blockDate')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Seasonal pricing rules */}
      <div className="bg-surface rounded-xl border border-rule shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-rule flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-ink">{t('seasonalRules.title')}</h2>
            <p className="text-xs text-ink-mute mt-0.5">
              {t('seasonalRules.desc', { count: allVillas.length || 3 })}
            </p>
          </div>
          <button type="button" onClick={() => toast.info(t('seasonalRules.ruleEditorSoon'))} className="inline-flex items-center gap-1.5 text-xs font-semibold text-jade hover:text-jade-deep transition-colors">
            <Plus className="size-3.5" />
            {t('seasonalRules.addRule')}
          </button>
        </div>

        {rules.length === 0 ? (
          <div className="py-10 text-center text-sm text-ink-mute">{t('seasonalRules.noRules')}</div>
        ) : (
          <div className="divide-y divide-rule">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-4 px-5 py-3">
                <div className="size-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="size-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">{rule.name}</p>
                  <p className="text-xs text-ink-mute mt-0.5">{rule.dates}</p>
                </div>
                <span className="text-sm font-mono font-semibold text-success shrink-0">{rule.markup}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" onClick={() => toast.info(t('seasonalRules.ruleEditorSoon'))} className="size-7 flex items-center justify-center rounded-md text-ink-mute hover:bg-jade-soft hover:text-jade transition-colors">
                    <Pencil className="size-3.5" />
                  </button>
                  <button type="button" onClick={() => removeRule(rule.id)} className="size-7 flex items-center justify-center rounded-md text-ink-mute hover:bg-danger/10 hover:text-danger transition-colors">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
