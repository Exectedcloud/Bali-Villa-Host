'use client';

const IDR_TO_CNY = 1 / 2150;

const DISCOUNT_CONFIGS = [
  { key: 'newListing',   pctKey: 'newListingPct',   label: 'New listing discount',          hint: '20% off your first 3 bookings — helps build reviews fast' },
  { key: 'lastMinute',   pctKey: 'lastMinutePct',   label: 'Last-minute discount',          hint: 'Applied when a guest books within 7 days of check-in' },
  { key: 'weeklyDiscount',  pctKey: 'weeklyPct',    label: 'Weekly stay discount (7+ nights)',  hint: 'Attract longer stays and reduce turnover costs' },
  { key: 'monthlyDiscount', pctKey: 'monthlyPct',   label: 'Monthly stay discount (28+ nights)', hint: 'Fill your calendar with long-term guests' },
];

const POLICIES = [
  {
    id: 'flexible',
    name: 'Flexible',
    desc: 'Full refund up to 24 hours before check-in',
    timeline: [
      { label: 'Booking → 24 h before', pct: 100, color: 'bg-success' },
      { label: 'Within 24 h', pct: 0, color: 'bg-rule' },
    ],
  },
  {
    id: 'moderate',
    name: 'Moderate',
    desc: 'Full refund 5+ days before; 50% within 5 days',
    timeline: [
      { label: '5+ days before', pct: 100, color: 'bg-success' },
      { label: '1–5 days before', pct: 50, color: 'bg-warn' },
      { label: 'Day of check-in', pct: 0, color: 'bg-rule' },
    ],
  },
  {
    id: 'strict',
    name: 'Strict',
    desc: 'Full refund within 48 h of booking if 14+ days away',
    timeline: [
      { label: '48 h window', pct: 100, color: 'bg-success' },
      { label: '7+ days before', pct: 50, color: 'bg-warn' },
      { label: 'Under 7 days', pct: 0, color: 'bg-rule' },
    ],
  },
];

const HOUSE_RULES = [
  { id: 'no_smoking',    label: 'No smoking' },
  { id: 'no_parties',    label: 'No parties or events' },
  { id: 'no_pets',       label: 'No pets' },
  { id: 'children_ok',   label: 'Children welcome' },
  { id: 'quiet_hours',   label: 'Quiet hours after 10 pm' },
  { id: 'register_guests', label: 'All guests must be registered' },
];

function Toggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        on ? 'bg-jade' : 'bg-rule'
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow transition-transform duration-200 ${
          on ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

const inputCls = 'h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors';

export function Step3Form({ data, patch, showErrors }) {
  const rawIdr = Number(data.basePriceIdr.replace(/\D/g, '')) || 0;
  const cnyPreview = rawIdr > 0 ? Math.round(rawIdr * IDR_TO_CNY) : null;

  function toggleRule(id) {
    const has = data.houseRules.includes(id);
    patch({ houseRules: has ? data.houseRules.filter((r) => r !== id) : [...data.houseRules, id] });
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Base price */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Nightly price</h2>
        <div className="flex flex-col gap-2">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-mute">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={data.basePriceIdr}
              onChange={(e) => patch({ basePriceIdr: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') })}
              placeholder="1,500,000"
              className={`${inputCls} w-full pl-10`}
            />
          </div>
          {cnyPreview !== null && (
            <p className="text-xs text-mist font-mono">
              ≈ ¥{cnyPreview.toLocaleString()} per night at current rate
            </p>
          )}
          {showErrors && rawIdr === 0 && (
            <p className="text-xs text-danger">Nightly price is required</p>
          )}
        </div>

        {/* Weekend premium */}
        <div className="bg-surface rounded-xl border border-rule p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">Weekend premium</p>
              <p className="text-xs text-ink-mute mt-0.5">Applied on Friday and Saturday nights</p>
            </div>
            <span className="font-mono text-sm font-semibold text-jade">+{data.weekendPremium}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={data.weekendPremium}
            onChange={(e) => patch({ weekendPremium: Number(e.target.value) })}
            className="w-full accent-jade"
          />
          <div className="flex justify-between text-xs text-ink-mute">
            <span>No premium</span>
            <span>+50%</span>
          </div>
        </div>

        {/* Cleaning fee */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-soft">Cleaning fee (optional)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-mute">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={data.cleaningFee}
              onChange={(e) => patch({ cleaningFee: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') })}
              placeholder="250,000"
              className={`${inputCls} w-full pl-10`}
            />
          </div>
        </div>
      </section>

      {/* Discounts */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Discounts</h2>
        <div className="flex flex-col divide-y divide-rule border border-rule rounded-xl overflow-hidden">
          {DISCOUNT_CONFIGS.map(({ key, pctKey, label, hint }) => (
            <div key={key} className="px-5 py-4 bg-surface flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <p className="text-xs text-ink-mute mt-0.5 leading-relaxed">{hint}</p>
                </div>
                <Toggle on={data[key]} onToggle={() => patch({ [key]: !data[key] })} />
              </div>
              {data[key] && (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={80}
                    value={data[pctKey]}
                    onChange={(e) => patch({ [pctKey]: Number(e.target.value) })}
                    className="w-20 h-9 px-3 rounded-lg border border-rule bg-paper text-sm text-ink font-mono focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors"
                  />
                  <span className="text-sm text-ink-mute">% off</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Cancellation policy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Cancellation policy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {POLICIES.map((policy) => {
            const selected = data.cancellationPolicy === policy.id;
            return (
              <button
                key={policy.id}
                type="button"
                onClick={() => patch({ cancellationPolicy: policy.id })}
                className={`text-left rounded-xl border-2 p-4 flex flex-col gap-3 transition-colors ${
                  selected ? 'border-jade bg-jade-soft' : 'border-rule bg-surface hover:border-jade/40'
                }`}
              >
                <p className={`text-sm font-semibold ${selected ? 'text-jade' : 'text-ink'}`}>{policy.name}</p>
                <p className="text-xs text-ink-mute leading-relaxed">{policy.desc}</p>
                <div className="flex flex-col gap-1.5 mt-1">
                  {policy.timeline.map((t) => (
                    <div key={t.label} className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <div className={`h-2 rounded-full shrink-0 ${t.color}`} style={{ width: `${Math.max(t.pct, 8)}%` }} />
                      </div>
                      <span className="text-xs font-mono text-ink-mute shrink-0">{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* House rules */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">House rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HOUSE_RULES.map(({ id, label }) => (
            <label key={id} className="flex items-center gap-3 cursor-pointer group bg-surface rounded-xl border border-rule px-4 py-3 hover:border-jade/50 transition-colors">
              <input
                type="checkbox"
                checked={data.houseRules.includes(id)}
                onChange={() => toggleRule(id)}
                className="size-4 rounded accent-jade shrink-0"
              />
              <span className="text-sm text-ink-soft group-hover:text-ink transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Check-in / out times */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Check-in &amp; check-out</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft">Check-in from</label>
            <input
              type="time"
              value={data.checkInFrom}
              onChange={(e) => patch({ checkInFrom: e.target.value })}
              className={`${inputCls} w-full`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft">Check-in until</label>
            <input
              type="time"
              value={data.checkInUntil}
              onChange={(e) => patch({ checkInUntil: e.target.value })}
              className={`${inputCls} w-full`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft">Check-out by</label>
            <input
              type="time"
              value={data.checkOut}
              onChange={(e) => patch({ checkOut: e.target.value })}
              className={`${inputCls} w-full`}
            />
          </div>
        </div>
      </section>

      {/* Stay length */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Stay length</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft">Minimum nights</label>
            <input
              type="number"
              min={1}
              max={365}
              value={data.minNights}
              onChange={(e) => patch({ minNights: Number(e.target.value) })}
              className={`${inputCls} w-full`}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft">Maximum nights</label>
            <input
              type="number"
              min={1}
              max={365}
              value={data.maxNights}
              onChange={(e) => patch({ maxNights: Number(e.target.value) })}
              className={`${inputCls} w-full`}
            />
          </div>
        </div>
      </section>

      {/* Instant Book */}
      <section>
        <div className="bg-surface rounded-xl border border-rule p-5 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-ink">Instant Book</p>
            <p className="text-xs text-ink-mute mt-1 leading-relaxed max-w-sm">
              When on, guests can book without your approval. When off, you review each request before confirming.
            </p>
          </div>
          <Toggle on={data.instantBook} onToggle={() => patch({ instantBook: !data.instantBook })} />
        </div>
      </section>
    </div>
  );
}
