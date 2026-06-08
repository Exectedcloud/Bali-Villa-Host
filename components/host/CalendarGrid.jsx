'use client';

import { useMemo } from 'react';

const BLOCKED_DATES = {
  'villa-1':  ['2026-05-08', '2026-05-09', '2026-05-13'],
  'villa-6':  ['2026-05-25', '2026-05-26'],
  'villa-11': ['2026-06-10'],
};

function pad(n) { return String(n).padStart(2, '0'); }
function toDateStr(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

function getCellState(villaId, dateStr, bookings) {
  if (BLOCKED_DATES[villaId]?.includes(dateStr)) {
    return { type: 'blocked', booking: null, isFirst: false };
  }
  const bk = bookings.find(
    (b) => b.villaId === villaId && dateStr >= b.checkIn && dateStr < b.checkOut
  );
  if (!bk) return { type: 'available', booking: null, isFirst: false };
  return {
    type: bk.status === 'pending_approval' ? 'pending' : 'booked',
    booking: bk,
    isFirst: dateStr === bk.checkIn,
  };
}

function initials(name) {
  return name.split(/[\s·]+/).map((p) => p[0] ?? '').join('').slice(0, 2).toUpperCase();
}

function isInRange(day, range) {
  if (!range) return false;
  const lo = Math.min(range.start, range.end);
  const hi = Math.max(range.start, range.end);
  return day >= lo && day <= hi;
}

/**
 * @param {{
 *   villas: import('@/lib/mock-data').Villa[],
 *   year: number,
 *   month: number,
 *   bookings: object[],
 *   selectedCell: { villaId: string, day: number } | null,
 *   selectionRange: { villaId: string, start: number, end: number } | null,
 *   onCellMouseDown: (villaId: string, day: number, state: object) => void,
 *   onCellMouseEnter: (villaId: string, day: number) => void,
 *   onCellMouseUp: () => void,
 * }} props
 */
export default function CalendarGrid({
  villas, year, month, bookings,
  selectedCell, selectionRange,
  onCellMouseDown, onCellMouseEnter, onCellMouseUp,
}) {
  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const dayMeta = useMemo(() => days.map((d) => {
    const date = new Date(year, month, d);
    const dow = date.getDay(); // 0=Sun, 6=Sat
    return {
      day: d,
      label: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
      isWeekend: dow === 0 || dow === 6,
      isToday: isCurrentMonth && d === today.getDate(),
    };
  }), [days, year, month, isCurrentMonth]);

  return (
    <div
      className="overflow-x-auto rounded-xl border border-rule shadow-sm"
      onMouseUp={onCellMouseUp}
      onMouseLeave={onCellMouseUp}
    >
      <table
        className="border-collapse select-none table-fixed"
        style={{ minWidth: `${176 + daysInMonth * 38}px` }}
      >
        <thead>
          <tr>
            {/* Villa column header */}
            <th
              className="sticky left-0 z-20 bg-surface w-44 px-3 py-2.5 border-b border-r border-rule text-left"
              style={{ width: 176 }}
            >
              <span className="text-[10px] font-semibold text-ink-mute uppercase tracking-widest">Villa</span>
            </th>

            {/* Day headers */}
            {dayMeta.map(({ day, label, isWeekend, isToday }) => (
              <th
                key={day}
                style={{ width: 38, minWidth: 38 }}
                className={`px-0 py-2 border-b border-r border-rule text-center align-middle ${
                  isWeekend ? 'bg-surface-alt/60' : 'bg-surface'
                }`}
              >
                <span className="block text-[9px] font-medium text-ink-mute leading-none">{label}</span>
                <span className={`block text-[11px] font-semibold mt-0.5 leading-none ${
                  isToday
                    ? 'text-white bg-jade rounded-full size-5 mx-auto flex items-center justify-center'
                    : isWeekend ? 'text-ink-mute' : 'text-ink-soft'
                }`}>
                  {day}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {villas.map((villa, rowIdx) => {
            const rowBg = rowIdx % 2 === 1 ? '#EADFC926' : 'transparent';
            return (
              <tr key={villa.id}>
                {/* Sticky villa label */}
                <td
                  className="sticky left-0 z-10 bg-surface border-b border-r border-rule px-3 py-2"
                  style={{ width: 176 }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={villa.photos[0]}
                      alt={villa.titleEn}
                      className="size-8 rounded-md object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-ink leading-tight truncate" style={{ maxWidth: 108 }}>
                        {villa.titleEn.replace(/^Villa /, '')}
                      </p>
                      <p className="text-[10px] text-ink-mute mt-0.5">{villa.bedrooms}BR · {villa.maxGuests} guests</p>
                    </div>
                  </div>
                </td>

                {/* Day cells */}
                {days.map((day) => {
                  const dateStr = toDateStr(year, month, day);
                  const state = getCellState(villa.id, dateStr, bookings);
                  const isSelected = selectedCell?.villaId === villa.id && selectedCell?.day === day;
                  const inRange = selectionRange?.villaId === villa.id && isInRange(day, selectionRange);
                  const meta = dayMeta[day - 1];

                  let bg = meta.isWeekend ? '#EADFC960' : rowBg;
                  let extra = '';
                  let cursor = 'cursor-pointer';
                  let inner = null;

                  if (state.type === 'booked') {
                    bg = '#EAF1EE';
                    extra = 'hover:brightness-95';
                    if (state.isFirst && state.booking) {
                      inner = (
                        <span className="text-[9px] font-bold text-jade-deep leading-none select-none">
                          {initials(state.booking.guestName)}
                        </span>
                      );
                    }
                  } else if (state.type === 'pending') {
                    bg = 'rgba(201,169,97,0.18)';
                    extra = 'border-l-2 border-l-gold hover:brightness-95';
                    if (state.isFirst && state.booking) {
                      inner = (
                        <span className="text-[9px] font-bold leading-none select-none" style={{ color: '#C47919' }}>
                          {initials(state.booking.guestName)}
                        </span>
                      );
                    }
                  } else if (state.type === 'blocked') {
                    bg = 'rgba(155,184,176,0.18)';
                    cursor = 'cursor-default';
                  } else if (inRange) {
                    bg = 'rgba(234,241,238,0.85)';
                    extra = 'ring-1 ring-inset ring-jade/25';
                  } else if (isSelected) {
                    bg = '#EAF1EE';
                    extra = 'ring-1 ring-inset ring-jade/50';
                  } else {
                    extra = 'hover:bg-jade-soft/50';
                  }

                  return (
                    <td
                      key={day}
                      className={`relative border-b border-r border-rule transition-[background] duration-75 ${extra} ${cursor}`}
                      style={{ width: 38, background: bg }}
                      onMouseDown={() => onCellMouseDown(villa.id, day, state)}
                      onMouseEnter={() => onCellMouseEnter(villa.id, day)}
                      onMouseUp={onCellMouseUp}
                    >
                      <div className="w-[38px] h-7 flex items-center justify-center overflow-hidden relative">
                        {inner}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
