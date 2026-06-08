'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ApiError } from '@/lib/api-client';

const POLICIES = [
  { id: 'flexible', label: 'Flexible', desc: 'Full refund up to 24 h before check-in' },
  { id: 'moderate', label: 'Moderate', desc: 'Full refund 5+ days before; 50% within 5 days' },
  { id: 'strict',   label: 'Strict',   desc: 'Full refund within 48 h of booking if 14+ days away' },
];

const HOUSE_RULES = [
  { id: 'no_smoking',      label: 'No smoking' },
  { id: 'no_parties',      label: 'No parties or events' },
  { id: 'no_pets',         label: 'No pets' },
  { id: 'children_ok',     label: 'Children welcome' },
  { id: 'quiet_hours',     label: 'Quiet hours after 10 pm' },
  { id: 'register_guests', label: 'All guests must be registered' },
];

const inputCls = 'h-11 px-3.5 rounded-lg border border-rule bg-paper text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-jade/40 focus:border-jade transition-colors w-full';

function Toggle({ on, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${on ? 'bg-jade' : 'bg-rule'}`}
    >
      <span className={`inline-block size-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function ListingSettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ['host-villa', id],
    queryFn: () => api.get(`/host/villas/${id}/`),
  });

  const villa = data?.villa;

  const [form, setForm] = useState(null);

  if (!form && villa) {
    setForm({
      basePriceIdr: villa.basePriceIdr?.toString() ?? '',
      cleaningFee: villa.cleaningFeeIdr?.toString() ?? '',
      weekendPremium: villa.weekendPremiumPct ?? 0,
      minNights: villa.minNights ?? 1,
      maxNights: villa.maxNights ?? 30,
      cancellationPolicy: villa.cancellationPolicy ?? 'moderate',
      instantBook: villa.instantBook ?? false,
      houseRules: villa.houseRules ?? [],
    });
  }

  const mutation = useMutation({
    mutationFn: (payload) => api.patch(`/host/villas/${id}/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['host-villas'] });
      queryClient.invalidateQueries({ queryKey: ['host-villa', id] });
      toast.success('Settings saved');
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : 'Failed to save settings.');
    },
  });

  function patch(updates) {
    setForm((f) => ({ ...f, ...updates }));
  }

  function toggleRule(ruleId) {
    const has = form.houseRules.includes(ruleId);
    patch({ houseRules: has ? form.houseRules.filter((r) => r !== ruleId) : [...form.houseRules, ruleId] });
  }

  function handleSave() {
    const basePrice = Number(form.basePriceIdr.replace(/\D/g, ''));
    if (!basePrice) { toast.error('Nightly price is required'); return; }
    mutation.mutate({
      basePriceIdr: basePrice,
      cleaningFee: Number(form.cleaningFee.replace(/\D/g, '')) || 0,
      weekendPremium: form.weekendPremium,
      minNights: form.minNights,
      maxNights: form.maxNights,
      cancellationPolicy: form.cancellationPolicy,
      instantBook: form.instantBook,
      houseRules: form.houseRules,
    });
  }

  if (isPending || !form) {
    return (
      <div className="max-w-2xl flex flex-col gap-6">
        <div className="h-8 w-48 rounded-lg bg-surface-alt animate-pulse" />
        <div className="h-64 rounded-2xl bg-surface-alt animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/dashboard/listings')}
          className="size-9 rounded-xl border border-rule flex items-center justify-center text-ink-mute hover:bg-surface-alt hover:text-ink transition-colors shrink-0"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">{villa?.titleEn || 'Listing settings'}</h1>
          <p className="text-sm text-ink-mute mt-0.5">Pricing, rules, and availability settings</p>
        </div>
      </div>

      {/* Nightly price */}
      <section className="bg-surface rounded-2xl border border-rule p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-ink">Pricing</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-soft">Nightly price (IDR)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-mute">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.basePriceIdr}
              onChange={(e) => patch({ basePriceIdr: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') })}
              placeholder="1,500,000"
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-soft">Cleaning fee (optional)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-ink-mute">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={form.cleaningFee}
              onChange={(e) => patch({ cleaningFee: e.target.value.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') })}
              placeholder="250,000"
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Weekend premium</p>
              <p className="text-xs text-ink-mute">Applied on Friday and Saturday nights</p>
            </div>
            <span className="font-mono text-sm font-semibold text-jade">+{form.weekendPremium}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={5}
            value={form.weekendPremium}
            onChange={(e) => patch({ weekendPremium: Number(e.target.value) })}
            className="w-full accent-jade"
          />
          <div className="flex justify-between text-xs text-ink-mute">
            <span>No premium</span>
            <span>+50%</span>
          </div>
        </div>
      </section>

      {/* Stay length */}
      <section className="bg-surface rounded-2xl border border-rule p-6 flex flex-col gap-5">
        <h2 className="text-base font-semibold text-ink">Stay length</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft">Minimum nights</label>
            <input
              type="number"
              min={1}
              max={365}
              value={form.minNights}
              onChange={(e) => patch({ minNights: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-soft">Maximum nights</label>
            <input
              type="number"
              min={1}
              max={365}
              value={form.maxNights}
              onChange={(e) => patch({ maxNights: Number(e.target.value) })}
              className={inputCls}
            />
          </div>
        </div>
      </section>

      {/* Cancellation policy */}
      <section className="bg-surface rounded-2xl border border-rule p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">Cancellation policy</h2>
        <div className="flex flex-col gap-3">
          {POLICIES.map((p) => (
            <label
              key={p.id}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                form.cancellationPolicy === p.id ? 'border-jade bg-jade-soft' : 'border-rule bg-paper hover:border-jade/40'
              }`}
            >
              <input
                type="radio"
                name="policy"
                value={p.id}
                checked={form.cancellationPolicy === p.id}
                onChange={() => patch({ cancellationPolicy: p.id })}
                className="mt-0.5 accent-jade shrink-0"
              />
              <div>
                <p className={`text-sm font-semibold ${form.cancellationPolicy === p.id ? 'text-jade' : 'text-ink'}`}>{p.label}</p>
                <p className="text-xs text-ink-mute mt-0.5">{p.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* House rules */}
      <section className="bg-surface rounded-2xl border border-rule p-6 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-ink">House rules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HOUSE_RULES.map(({ id: ruleId, label }) => (
            <label key={ruleId} className="flex items-center gap-3 cursor-pointer group bg-paper rounded-xl border border-rule px-4 py-3 hover:border-jade/50 transition-colors">
              <input
                type="checkbox"
                checked={form.houseRules.includes(ruleId)}
                onChange={() => toggleRule(ruleId)}
                className="size-4 rounded accent-jade shrink-0"
              />
              <span className="text-sm text-ink-soft group-hover:text-ink transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Instant Book */}
      <section className="bg-surface rounded-2xl border border-rule p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-ink">Instant Book</p>
            <p className="text-xs text-ink-mute mt-1 leading-relaxed max-w-sm">
              When on, guests can book without your approval. When off, you review each request first.
            </p>
          </div>
          <Toggle on={form.instantBook} onToggle={() => patch({ instantBook: !form.instantBook })} />
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end pb-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={mutation.isPending}
          className="px-8 py-3 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-deep disabled:opacity-50 disabled:pointer-events-none transition-colors"
        >
          {mutation.isPending ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
